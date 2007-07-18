<?php
class EventMarkupPanel extends MarkupPanel
{
	private $Eventees;
	private $EventSpace;
	private $Larvae;
	public $ComponentSpace;
	private $TempString;
	
	function EventMarkupPanel($markupStringOrFile, $left=0, $top=0, $width = 200, $height = 200)
	{
		$this->ComponentSpace = array();
		parent::MarkupPanel($markupStringOrFile, $left, $top, $width, $height);
	}
	function SetMarkupString($markupStringOrFile)
	{
		$this->Eventees = array();
		$this->Larvae = array();
		foreach($this->ComponentSpace as $component)
			$component->SecondGuessShowStatus();
		$this->ComponentSpace = array();
		$this->MarkupString = $markupStringOrFile;
		$text = is_file($markupStringOrFile)?file_get_contents($markupStringOrFile):$markupStringOrFile;
		$text = str_replace(array("\r\n", "\n", "\r", "\"", "'"), array("<Nendl>", "<Nendl>", "<Nendl>", "<NQt2>", "<NQt1>"), ($tmpFullString = $this->ParseItems($text)));
		$this->AutoWidthHeight($tmpFullString);
		if($this->GetShowStatus()!==0)
			//QueueClientFunction($this, "SetMarkupString", array("'$this->Id'", "'$markupStringOrFile'"), true, Priority::High);
			AddScript("SetMarkupString('$this->Id', '$text')", Priority::High);
		else 
			$this->TempString = $text;
	}
	// New one's. Has issues.
	
	private function ParseItems($text)
	{
		//do 
		//{
			$text = preg_replace_callback('!<n:(.*?)(\s+.*?)?\s*descriptor\s*=\s*([�"\'])([^�"\']+)\3(.*?)>(.*?)</n:(\w+)>!is',
            	array($this, 'MarkupReplace'), $text, -1, $count);
  		//}while ($count);
  		return $text;
	}/*
	private function MarkupReplace($matches)
	{
		static $id;
		$Id = $this->Id . "i" . ++$id;
		$keyval = explode(':', $matches[4]);
		if(strtolower($matches[1]) == 'component')
		{
			$this->Larvae[$Id] = array($keyval[0], $keyval[1]);
			return "<div id=<NQt2>$Id<NQt2>$matches[2]$matches[5]>$matches[6]</div>";
		}
		else 
		{
			$this->Eventees[$Id] = array($matches[1], $keyval[0], $keyval[1]);
			return "<$matches[1]$matches[2] id=<NQt2>$Id<NQt2>$matches[5]>$matches[6]</$matches[7]>";
		}
	}*/
	private function MarkupReplace($matches)
	{
		static $id;
		$Id = $this->Id . "i" . ++$id;
		$keyval = explode(':', $matches[4]);
		if(strtolower($matches[1]) == 'component')
		{
			$this->Larvae[$Id] = array($keyval[0], $keyval[1]);
			return "<div id=\"$Id\"$matches[2]$matches[5]>$matches[6]</div>";
		}
		else 
		{
			$this->Eventees[$Id] = array($matches[1], $keyval[0], $keyval[1]);
			return "<$matches[1]$matches[2] id=\"$Id\"$matches[5]>$matches[6]</$matches[7]>";
		}
	}
	
	// Temporary one.
	/*private function MarkupReplace($matches)
	{
		static $id;
		$Id = $this->Id . "e" . ++$id;
		$keyval = explode(':', $matches[3]);
		if(strtolower($matches[1]) == 'component')
		{
			$this->Larvae[$Id] = array($keyval[0], $keyval[1]);
			return "<div id=\"$Id\">$matches[4]</div>";
		}
		else 
		{
			$this->Eventees[$Id] = array($matches[1], $keyval[0], $keyval[1]);
			return "<$matches[1] id=\"$Id\">$matches[4]</$matches[5]>";
		}
	}*/
	// Old one's. No Larvae.
	/*private function ParseItems($text)
	{
		$this->Eventees = array();
		$this->Larvae = array();
		do 
		{
			$text = preg_replace_callback('!<n:(.*?)\s+descriptor\s*=\s*([�"\'])([^�"\']+)\2.*?>(.*?)</n:(\w+)>!is', array($this,'MarkupReplace'), $text, -1, $count);
  		}while ($count);
  		return $text;
	}
	/*
	private function MarkupReplace($matches)
	{
		//global $lookup;
		static $id;
		$Id = $this->Id . "e" . ++$id;
		$keyval = explode(':', $matches[3]);
		$this->Eventees[$Id] = array($matches[1], $keyval[0], $keyval[1]);
		return "<$matches[1] id=\"$Id\">$matches[4]</$matches[5]>";
	}
	*/
	public function GetEventees($byValue=null)
	{
		$eventees = array();
		if($byValue===null)
			foreach($this->Eventees as $id => $info)
				$eventees[] = new Eventee($id, $info[1], $info[2], $this->Id);
		else 
			foreach($this->Eventees as $id => $info)
				if($info[1] == $byValue)
					$eventees[] = new Eventee($id, $info[1], $info[2], $this->Id);
		return $eventees;
	}
	public function GetLarvae($byValue=null)
	{
		$larvae = array();
		if($byValue===null)
			foreach($this->Larvae as $id => $info)
				$larvae[] = new Larva($id, $info[0], $info[1], $this->Id);
		else 
			foreach($this->Eventees as $id => $info)
				if($info[0] == $byValue)
					$larvae[] = new Larva($id, $info[0], $info[1], $this->Id);
		return $larvae;
	}
	public function GetMarkupItems($byValue=null)
	{
		return array_merge($this->GetEventees($byValue), $this->GetLarvae($byValue));
	}
	public function UpdateEvent($eventType, $eventeeId=null)
	{
		if($eventeeId == null)
			return parent::UpdateEvent($eventType);
		
		NolohInternal::SetProperty(Event::ConvertToJS($eventType), $eventType, $eventeeId);
	}
	public function GetEvent($eventType, $eventeeId=null)
	{
		if($eventeeId == null)
			return parent::GetEvent($eventType);
		
		if(!isset($this->EventSpace[$eventeeId]))
			$this->EventSpace[$eventeeId] = array();
		if(!isset($this->EventSpace[$eventeeId][$eventType]))
			$this->EventSpace[$eventeeId][$eventType] = new Event(array(), array(array(array($this->Id, $eventeeId), $eventType)));
		return $this->EventSpace[$eventeeId][$eventType];
	}
	public function SetEvent($eventObj, $eventType, $eventeeId=null)
	{
		if($eventeeId == null)
			return parent::SetEvent($eventObj, $eventType);
		
		if(!isset($this->EventSpace[$eventeeId]))
			$this->EventSpace[$eventeeId] = array();		
		$this->EventSpace[$eventeeId][$eventType] = $eventObj;
		$pair = array(array($this->PanelId, $eventeeId), $eventType);
		if($eventObj != null && !in_array($pair, $eventObj->Handles))
			$eventObj->Handles[] = $pair;
		$this->UpdateEvent($eventType, $eventeeId);
	}
	public function GetEventString($eventType, $eventeeId=null)
	{
		if($eventeeId == null)
			return parent::GetEventString($eventType);
		
		return $this->EventSpace[$eventeeId][$eventType]->GetEventString($eventType, $eventeeId);
	}
	public function ExecEvent($eventType, $eventeeId)
	{
		return $this->EventSpace[$eventeeId][$eventType]->Exec($execClientEvents=false);
	}
	public function Show()
	{
		parent::Show();
		AddScript("SetMarkupString('$this->Id', '$this->TempString')", Priority::High);
		$this->TempString = null;
	}
}
?>