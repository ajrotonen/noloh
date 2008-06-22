<?php
/**
 * Panel class
 *
 * We're sorry, but this class doesn't have a description yet. We're working very hard on our documentation so check back soon!
 * 
 * @package Controls/Core
 */
class Panel extends Control
{
	/**
	* Controls, An ArrayList to hold this Control's Controls
	* @var ArrayList
	*/
	public $Controls;
	/**
	 * ScrollLeft of the component
	 * @var integer
	 */
	private $ScrollLeft;
	/**
	 * ScrollTop of the component
	 * @var integer
	 */
	private $ScrollTop;
	private $Scrolling;
	public $SelectFix;
	//public $DropShadow;
	
	function Panel($left = 0, $top = 0, $width = 100, $height = 100, $implicitObject = null)
	{
		parent::Control($left, $top, $width, $height);
		if($implicitObject == null)
			$this->Controls = new ArrayList();
		elseif($implicitObject == $this)
			$this->Controls = new ImplicitArrayList();
		else 
			$this->Controls = new ImplicitArrayList($implicitObject);
		$this->Controls->ParentId = $this->Id;
		$this->SetScrolling(($width === null || $height === null)?null:false);
		$this->SetCSSClass();
	}
	function GetScroll()							{return $this->GetEvent('Scroll');}
	function SetScroll($scroll)						{$this->SetEvent($scroll, 'Scroll');}
	function GetScrollLeft()
	{
		return $this->ScrollLeft;
	}
    function SetScrollLeft($scrollLeft)
    {
    	$scrollLeft = $scrollLeft==Layout::Left?0: $scrollLeft==Layout::Right?9999: $scrollLeft;
        if($_SESSION['_NIsIE'])
    		QueueClientFunction($this, 'NOLOHChange', array('\''.$this->Id.'\'', '\'scrollLeft\'', $scrollLeft), false, Priority::High);
    	else
        	NolohInternal::SetProperty('scrollLeft', $scrollLeft, $this);
        $this->ScrollLeft = $scrollLeft;
    }
    function GetScrollTop()
    {
    	return $this->ScrollTop;
    }
    function SetScrollTop($scrollTop)
    {
    	$scrollTop = $scrollTop==Layout::Top?0: $scrollTop==Layout::Bottom?9999: $scrollTop;
    	if($_SESSION['_NIsIE'])
    		QueueClientFunction($this, 'NOLOHChange', array('\''.$this->Id.'\'', '\'scrollTop\'', $scrollTop), false, Priority::High);
    	else
        	NolohInternal::SetProperty('scrollTop', $scrollTop, $this);
        $this->ScrollTop = $scrollTop;
    }
    /**
     * @ignore
     */
	function SetCSSClass($cssClass=null)
	{
		parent::SetCSSClass('NPanel '.$cssClass);
	}		
	function OpenPrintableVersion()
	{
		AddScript('var oldNode = _N(\''.$this->Id.'\'); var newWin = window.open(); newWin.document.write(oldNode.innerHTML);');
	}
	function GetScrolling()
	{
		return $this->Scrolling;
	}
	function SetScrolling($scrollType)
	{
		$this->Scrolling = $scrollType;
		$tmpScroll = null;
		if($scrollType == System::Auto)
			$tmpScroll = 'auto';
		elseif($scrollType == System::Full)
			$tmpScroll = 'visible';
		elseif($scrollType === null)
			$tmpScroll = '';
		elseif($scrollType == System::Horizontal)
		{
			$tmpScroll = '';
			NolohInternal::SetProperty('style.overflowX', 'auto', $this);
			NolohInternal::SetProperty('style.overflowY', 'hidden', $this);
		}
		elseif($scrollType == System::Vertical)
		{
			
			$tmpScroll = '';
			NolohInternal::SetProperty('style.overflowX', 'hidden', $this);
			NolohInternal::SetProperty('style.overflowY', 'auto', $this);
		}
		elseif($scrollType)
			$tmpScroll = 'scroll';
		else//if(!$scrollType)
			$tmpScroll = 'hidden';
		//Alert($tmpScroll);
		NolohInternal::SetProperty('style.overflow', $tmpScroll, $this);
	}
	/**
	 * @ignore
	 */
	function GetStyleString()
	{
		return parent::Show();
	}
	/**
	 * @ignore
	 */
	function Show()
	{
        NolohInternal::Show('DIV', parent::Show(), $this);
		//$initialProperties = $this->GetStyleString();
		//$initialProperties = parent::Show();
		//NolohInternal::Show('DIV', $initialProperties, $this);

//			if(false && $this->SelectFix && (GetBrowser() == "ie"))
//			{
//				$initialProperties = "'id','{$this->Id}IFRAME','style.position','absolute','style.left','{$this->Left}px','style.top','{$this->Top}px','style.width','{$this->Width}px','style.height','{$this->Height}px','src','javascript:false','scrolling','no','frameborder','0'";
//				NolohInternal::Show("IFRAME", $initialProperties, $this);
//				AddScript("_N('{$this->Id}').ShiftsWith = '{$this->Id}IFRAME'");
//			}
		
		
		/*
		if($showIFrame)
			$dispStr .= "<IFRAME ID = '{$this->Id}IFRAME' style='POSITION:absolute; LEFT:{$this->Left}px; TOP:{$this->Top}px; WIDTH:{$this->Width}px; HEIGHT:{$this->Height}px;' src='javascript:false;' scrolling='no' frameborder='0'></IFRAME>";
		//if($this->DropShadow == true)
		//{
		//	print(str_repeat("  ", $IndentLevel) . "<DIV ID = '{$this->Id}DS' style='POSITION:absolute; LEFT:".($this->Left + 5)."px; TOP:".($this->Top+5)."px; WIDTH:{$this->Width}px; HEIGHT:{$this->Height}px; background:black; filter:alpha(opacity=20)'></DIV>\n");
		//	AddScript("_N('{$this->Id}').ShiftsWith = '{$this->Id}DS'");
		//}
			/*else
			{
				print(str_repeat("  ", $IndentLevel) . "<IFRAME ID = '{$this->Id}IFRAME' style='POSITION:absolute; LEFT:{$this->Left}px; TOP:{$this->Top}px; WIDTH:{$this->Width}px; HEIGHT:{$this->Height}px; filter: alpha(opacity=0)' src='javascript:false;' scrolling='no' frameborder='0'></IFRAME>\n");
				AddScript("_N('{$this->Id}').ShiftsWith = '{$this->Id}IFRAME'");
			}*
		
		$dispStr .= "<DIV " . $parentShow;
		//if(GetBrowser() == "ie" && $this->AddIFrame == true)
			//print(str_repeat("  ", $IndentLevel+1) . "<IFRAME style='POSITION:absolute; LEFT:0px; TOP:0px; WIDTH:{$this->Width}px; HEIGHT:{$this->Height}px; filter: alpha(opacity=0);' frameborder=0 scrolling=no src='javascript:false;'></IFRAME>\n");		
		$this->IterateThroughAllControls($IndentLevel);
		$dispStr .= "</DIV>";
		NolohInternal::Show($dispStr, $this);*/
		//$this->IterateThroughAllControls();
		//if($showIFrame)
		//	AddScript("_N('{$this->Id}').ShiftsWith = '{$this->Id}IFRAME'");

		//return $initialProperties;
	}
	function SetChildLayout($layout)
	{
		//This needs to be modified to actually set a property, and Controls needs to be Implict so when adding a control it can set the Layout right there
		$childCount = $this->Controls->Count();
		for($i=0;$i<$childCount;++$i)
			$this->Controls->Elements[$i]->Layout = $layout;
	}
	/**
	 * @ignore
	 */
	function SearchEngineShow()
	{
		foreach($this->Controls as $control)
			$control->SearchEngineShow();
	}
}
?>