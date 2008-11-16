<?php
/**
 * @ignore
 */
final class NolohInternal
{
	private function NolohInternal(){}

	public static function ControlQueue()
	{
        while (list($objId, $bool) = each($_SESSION['_NControlQueueRoot']))
			self::ShowControl(GetComponentById($objId), $bool);
			//self::ShowControl($control=&GetComponentById($objId), GetComponentById($control->GetParentId()), $bool);
	}

	public static function ShowControl($control/*, $parent*/, $bool)
	{
		/*if(!$parent)
		{
			$parent = GetComponentById(substr($str = $control->GetParentId(), 0, strpos($str, 'i')));
			if(!$parent)
			{
				$control->SecondGuessParent();
				return;
			}
		}
		if($parent->GetShowStatus()!==0)
		{*/
			if($bool)
			{
				if($control->GetShowStatus()===0)
					$control->Show();
                elseif($control->GetShowStatus()===1)
                	$control->Adopt();
				elseif($control->GetShowStatus()===2)
					$control->Resurrect();
			}
			elseif($control->GetShowStatus()!==0)
				$control->Bury();
		//}
		if(isset($_SESSION['_NControlQueueDeep'][$control->Id]))
		{
			while (list($childObjId, $bool) = each($_SESSION['_NControlQueueDeep'][$control->Id]))
				self::ShowControl(GetComponentById($childObjId)/*, $control*/, $bool);
			unset($_SESSION['_NControlQueueDeep'][$control->Id]);
		}
	}
	
	public static function Show($tag, $initialProperties, $obj, $addTo = null)
	{
		$objId = $obj->Id;
		$parent = $obj->GetParent();

		$propertiesString = self::GetPropertiesString($objId);
		if($propertiesString != '')
			$initialProperties .= ',' . $propertiesString;
			
		if($addTo == null)
			if($obj->GetBuoyant())
			{
				$addTo = 'N1';
				AddScript('_NByntSta(\''.$objId.'\',\''.$parent->GetAddId($obj).'\')', Priority::Low);
				unset($_SESSION['_NFunctionQueue'][$objId]['_NByntStp']);
			}
			else
				$addTo = $parent ? $parent->GetAddId($obj) : $obj->GetParentId();
		if(isset($_SESSION['_NControlInserts'][$objId]))
		{
			AddScript('_NAdd(\''.$addTo.'\',\''.$tag.'\',['.$initialProperties.'],\''.$_SESSION['_NControlInserts'][$objId].'\')', Priority::High);
			unset($_SESSION['_NControlInserts'][$objId]);
		}
		else
			AddScript('_NAdd(\''.$addTo.'\',\''.$tag.'\',['.$initialProperties.'])', Priority::High);
	}
	
	public static function Bury($obj)
	{
		AddScript('_NRem(\''.$obj->Id.'\')', Priority::High);
	}
	
	public static function Resurrect($obj)
	{
		AddScript('_NRes(\''.$obj->Id.'\',\''.($obj->GetBuoyant() ? 'N1' : $obj->GetParent()->GetAddId($obj)).'\')', Priority::High);
	}

    public static function Adoption($obj)
    {
        if(!$obj->GetBuoyant())
            AddScript('_NAdopt(\''.$obj->Id.'\',\'' . $obj->GetParent()->GetAddId($obj) . '\')', Priority::High);
        unset($_SESSION['_NControlQueue'][$obj->Id]);
    }
	
	public static function GetPropertiesString($objId, $nameValPairs=array())
	{
		$nameValPairsString = '';
		if(count($nameValPairs) === 0 && isset($_SESSION['_NPropertyQueue'][$objId]))
			$nameValPairs = $_SESSION['_NPropertyQueue'][$objId];
		foreach($nameValPairs as $name => $val)
		{
			if(is_string($val))
				$nameValPairsString .= '\''.$name.'\',\''.addslashes($val).'\',';
			elseif(is_numeric($val))
				$nameValPairsString .= '\''.$name.'\','.$val.',';
			elseif(is_array($val))									// EVENTS!
			{
				if(isset(Event::$Conversion[$name]))
					$nameValPairsString .= '\''.Event::$Conversion[$name].'\',\''.GetComponentById($objId)->GetEventString($val[0]).'\',';
				else 
					$nameValPairsString .= '\''.$name.'\',' . 'function(event) {' . GetComponentById($objId)->GetEventString($val[0]) . '},';
			}
			elseif(is_bool($val))
				$nameValPairsString .= '\''.$name.'\','.($val?'true':'false').',';
			elseif($val === null)
			{
				$splitStr = explode(' ', $name);
				$nameValPairsString .= '\''.$splitStr[0].'\',\'\',';
			}
			elseif(is_object($val))									// EMBEDS!
				$nameValPairsString .= '\''.$name.'\',\''.$val->GetInnerString().'\',';
		}
		unset($_SESSION['_NPropertyQueue'][$objId]);
		return rtrim($nameValPairsString, ',');
	}
	
	public static function SetPropertyQueue()
	{
		foreach($_SESSION['_NPropertyQueue'] as $objId => $nameValPairs)
		{
			$obj = &GetComponentById($objId);
			if($obj!=null && $obj->GetShowStatus())
				AddScript('_NSetP(\''.$objId.'\',['.self::GetPropertiesString($objId, $nameValPairs).'])');
			
			else 
			{
				$splitStr = explode('i', $objId, 2);
				$markupPanel = &GetComponentById($splitStr[0]);
				if($markupPanel!=null && $markupPanel->GetShowStatus())
				{
					AddNolohScriptSrc('Eventee.js');
					$nameValPairsString = '';
					foreach($nameValPairs as $name => $val)
						$nameValPairsString .= '\''.$name.'\',\''.($name=='href'?$val:$markupPanel->GetEventString($val, $objId)).'\',';
					AddScript('_NEvteeSetP(\''.$objId.'\',['.rtrim($nameValPairsString,',').'])');
				}
			}
		}
	}
	
	public static function SetProperty($name, $value, $obj)
	{
        $objId = is_object($obj) ? $obj->Id : $obj;
		if($GLOBALS['_NQueueDisabled'] != $objId)
		{
			if(!isset($_SESSION['_NPropertyQueue'][$objId]))
				$_SESSION['_NPropertyQueue'][$objId] = array();
			$_SESSION['_NPropertyQueue'][$objId][$name] = $value;
		}
	}
	
	public static function FunctionQueue()
	{
		foreach($_SESSION['_NFunctionQueue'] as $objId => $nameParam)
		{
			$obj = &GetComponentById($objId);
			if($obj != null)
			//{
				if($obj->GetShowStatus())
				{
					foreach($nameParam as $idx => $val)
						if(is_string($idx))
							AddScript($idx.'('.implode(',',$val[0]).')', $val[1]);
						else
							AddScript($val[0].'('.implode(',',$val[1]).')', $val[2]);
					unset($_SESSION['_NFunctionQueue'][$objId]);
				}
			//}
			//else
			//	Alert("Null Object: " . serialize($nameParam));
		}
	}
}
?>