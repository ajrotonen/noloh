SavedControls = new Array();
NOLOHChanges = new Object();
NOLOHKey = null;
NOLOHCaught = new Array();
ConversionArray = new Object();
ConversionArray["style.left"] = "Left";
ConversionArray["style.top"] = "Top";
ConversionArray["style.width"] = "Width";
ConversionArray["style.height"] = "Height";
ConversionArray["style.zIndex"] = "ZIndex";
ConversionArray["style.background"] = "BackColor";
ConversionArray["style.color"] = "Color";
ConversionArray["style.opacity"] = "Opacity";
ConversionArray["style.filter"] = "Opacity";
ConversionArray["value"] = "Text";
ConversionArray["newText"] = "Text";
ConversionArray["selectedIndex"] = "SelectedIndex";
ConversionArray["selectedTab"] = "SelectedTab";
ConversionArray["checked"] = "Checked";
ConversionArray["killlater"] = "KillLater";
ConversionArray["src"] = "Src";
ConversionArray["scrollLeft"] = "ScrollLeft";
ConversionArray["scrollTop"] = "ScrollTop";
ConversionArray["style.visibility"] = "ClientVisible";
ConversionArray["style.display"] = "ClientVisible";
ConversionArray["options"] = "Items";
ConversionArray["selectedIndices"] = "SelectedIndices";
ConversionArray["timer"] = "ServerVisible";
ConversionArray["CachedWidth"] = "CachedWidth";
ConversionArray["CachedHeight"] = "CachedHeight";
ConversionArray["calViewDate.setMonth"] = "ViewMonth";
ConversionArray["calViewDate.setFullYear"] = "ViewYear";
ConversionArray["calSelectDate.setDate"] = "Date";
ConversionArray["calSelectDate.setMonth"] = "Month";
ConversionArray["calSelectDate.setFullYear"] = "Year";
NOLOHUpload = new Object();
NOLOHUpload.FileUploadObjIds = new Array();
NOLOHVisit = -1;
HighestZIndex = 0;
LowestZIndex = 0;

function _NInit(loadLblId, loadImgId)
{
	document.body.NOLOHPostingBack = false;
	NOLOHCatchers = Array();
	window.onscroll = BodyScrollState;
	_NLoadLbl = loadLblId;
	_NLoadImg = loadImgId;
	var Graveyard = document.createElement("DIV");
	Graveyard.id = "Graveyard";
	Graveyard.style.display = "none";
	document.body.appendChild(Graveyard);
	NURL = location.toString();
	setInterval('CheckURL()', 500);
	var d=document.getElementById('NBackButton').contentWindow.document;
	d.open();
	d.write(location.toString());
	d.close();
}

function CheckURL()
{
	var inner = document.getElementById('NBackButton').contentWindow.document.body.innerHTML;
	if(NURL != location || NURL != inner)
		//if(/*document.body.NOLOHPostingBack && */location.toString().indexOf('#')==location.toString().length-1)
		//{
			//NURL = location.toString();
		//	NURL = inner;
		//	location = NURL;
		//}
		//else
		{
			location.replace(inner);
			location.reload(false);
		}
}

function AddSelectFix(obj, objstyle)
{
	return;
	var iFrame = document.createElement("IFRAME");
	iFrame.id = obj.id + "_SF";
	iFrame.setAttribute("src", "");
	iFrame.style.position = "absolute";
	iFrame.style.left = objstyle.left;
	iFrame.style.top = objstyle.top;
	iFrame.style.width = objstyle.width;
	iFrame.style.height = objstyle.height;
	//iFrame.style.zIndex = objstyle.zIndex-1;
	iFrame.scrolling = "no";
	iFrame.frameborder = 0;
	iFrame.style.display = "block";
	iFrame.style.filter = "alpha(opacity=0)";
	//iFrame.style.zIndex = objstyle.zIndex - 1;
	//obj.style.zIndex = objstyle.zIndex + 1;
	document.body.appendChild(iFrame);
	//document.body.appendChild(iFrame);
	//BringToFront(obj.id);
	//obj.parentNode.appendChild(iFrame);
	obj.SelectFix = document.getElementById(obj.id+"_SF");
	//BringToFront(obj.id);
	//obj.style.zIndex += 1;
	//obj.insertAdjacentHTML("beforeBegin", "<IFRAME id='"+obj.id+"_SF' style='position:absolute; left:"+objstyle.left+"; top:"+objstyle.top+"; width:"+objstyle.width+"; height:"+objstyle.height+/*"; z-index:"+(objstyle.zIndex-1)+*/";' scrolling='no' frameborder='0'></IFRAME>");
	//obj.SelectFix = document.getElementById(obj.id+"_SF");
	//BringToFront(obj.id);
}

function SaveControl(id)
{
	var temp = document.getElementById(id);
	SavedControls[id] = temp.cloneNode(true);
	SavedControls[id].selectedIndex = temp.selectedIndex;
	SavedControls[id].checked = temp.checked;
	SavedControls[id].SelectedTab = temp.SelectedTab;
	SavedControls[id].selectedIndices = ImplodeSelectedIndices(SavedControls[id].options);
	if(temp.calViewDate != null)
	{
		SavedControls[id].calViewDate = new Object();
		SavedControls[id].calSelectDate = new Object();
		SavedControls[id].calViewDate.setMonth = temp.calViewDate.getMonth();
		SavedControls[id].calViewDate.setYear = temp.calViewDate.getYear();
		SavedControls[id].calSelectDate.setDate = temp.calSelectDate.getDate();
		SavedControls[id].calSelectDate.setMonth = temp.calSelectDate.getMonth();
		SavedControls[id].calSelectDate.setYear = temp.calSelectDate.getYear();
	}
}

function ChangeAndSave(whatDistinctId, propertyString, newValue)
{
	NOLOHChange(whatDistinctId, propertyString, newValue);
	_NSave(whatDistinctId, propertyString, newValue);
}

function NOLOHChangeInit(whatDistinctId, propertyString)
{
	if(NOLOHChanges[whatDistinctId] == null)
		NOLOHChanges[whatDistinctId] = new Object();
	if(NOLOHChanges[whatDistinctId][propertyString] == null)
		NOLOHChanges[whatDistinctId][propertyString] = new Object();
}

function NOLOHChange(distinctId, propertyString, newValue)
{
	var tempObj;
	if(propertyString != "timer")
		tempObj = document.getElementById(distinctId);
	else
		eval("tempObj = window." + distinctId + ";");
	NOLOHChangeByObj(tempObj, propertyString, newValue);
}

function NOLOHChangeByObj(obj, propertyString, newValue)
{
	if(obj == null)
		return;
	switch(propertyString)
	{
		case "calViewDate.setMonth":
		case "calViewDate.setFullYear":
		case "calSelectDate.setDate":
		case "calSelectDate.setMonth":
		case "calSelectDate.setFullYear":
			eval("obj." + propertyString + "(newValue);");
			break;
		case "KeyPress":
		case "ReturnKey":
		case "TypePause":
			obj.onkeypress = function(event) 
			{
				_NSave(obj.id,'value',obj.value);
				if(obj.ReturnKey != null && window.event.keyCode == 13)
					obj.ReturnKey.call();
				if(obj.KeyPress != null)
				{
					NOLOHKey = window.event.keyCode;
					obj.KeyPress.call();
				}
				if(obj.TypePause != null/* && (window.event.keyCode < 37 || window.event.keyCode > 40)*/)
				{
					clearTimeout(obj.TypePauseTimeout);
					obj.TypePauseTimeout = setTimeout("var obj = document.getElementById('"+obj.id+"'); _NSave(obj.id,'value',obj.value); obj.TypePause.call();", 500);
				}
			}
		case "onblur":
		case "onchange":
		case "onclick":
		case "ondblclick":
		case "onelapsed":
		case "oninput":
		case "onmouseout":
		case "onmouseover":
		case "onmouseup":
		case "onload":
		case "onpaste":
		case "onscroll":
			eval("obj." + propertyString + " = function(event) {" + newValue + ";}");
			break;
		case "oncontextmenu":
			eval("obj.oncontextmenu = function(event) {" + newValue + "; return false;}");
			break;
		case "onmousedown":
			eval("obj.onmousedown = function(event) {if(obj.Shifts!=null) ShiftStart(obj.Shifts);" + newValue + ";}");
			break;
		case "DragCatch":
			if(newValue == "")
			{
				for(var i=0; i<NOLOHCatchers.length; i++)
					if(NOLOHCatchers[i] == obj.id)
					{
						NOLOHCatchers.splice(i, 1);
						break;
					}
			}
			else
				NOLOHCatchers.push(obj.id);
			eval("obj.DragCatch = function(event) {" + newValue + ";}");
			break;
		case "href":
			obj.href = newValue=="#" ? "javascript:void(0);" : newValue;
			break;
		case "Shifts":
		case "ChildrenArray":
			eval("obj." + propertyString + " = " + newValue + ";");
			break;
		case "style.background":
		case "style.filter":
			eval("obj." + propertyString + " = newValue;");
			var objstyle = obj.style;
			if(obj.parentNode != null && typeof obj.parentNode.id != "undefined" && propertyString == "style.background" && newValue != "" && (objstyle.filter == "" || objstyle.filter == "alpha(opacity=100)"))
				if(obj.SelectFix == null)
					AddSelectFix(obj, objstyle);
				else
					obj.SelectFix.display = "";
			else if(obj.SelectFix != null && objstyle.background == "" && (objstyle.filter != "" && objstyle.filter != "alpha(opacity=100)"))
				obj.SelectFix.style.display = "none";
			break;
		case "style.visibility":
			eval("obj." + propertyString + " = newValue;");
			if(obj.SelectFix != null)
				if(newValue == "hidden")
					obj.SelectFix.style.display = "none";
				else 
				{
					var objstyle = obj.style;
					if(objstyle.background != "" && (objstyle.filter == "" || objstyle.filter == "alpha(opacity=100)"))
						obj.SelectFix.style.display = "";
				}
			break;
		case "style.zIndex":
			if(newValue > HighestZIndex)
				HighestZIndex = newValue;
			if(newValue < LowestZIndex)
				LowestZIndex = newValue;
			if(obj.SelectFix != null)
				obj.SelectFix.style.zIndex = newValue - 1;
			obj.style.zIndex = newValue;
			break;
		case "style.left":
		case "style.top":
		case "style.width":
		case "style.height":
			if(obj.SelectFix != null)
				eval("obj.SelectFix." + propertyString + " = newValue;");
		default:
			eval("obj." + propertyString + " = newValue;");
/*			if(propertyString == "style.zIndex")
				if(obj.SelectFix != null)
					obj.SelectFix.style.zIndex = newValue - 1;*/
	}
}

function _NSave(whatDistinctId, propertyString, newValue)
{
	if(whatDistinctId.indexOf("_") >= 0)
		return;
	NOLOHChangeInit(whatDistinctId, propertyString);
	var tempObj;
	var propertyStringLower = propertyString.toLowerCase();
	if(propertyString != "timer")
		tempObj = document.getElementById(whatDistinctId);
	else
		eval("tempObj = window." + whatDistinctId + ";");
	if(typeof newValue == "undefined")
		eval("newValue = tempObj."+propertyString+";");
	switch(propertyString)
	{
		case "style.left":
		case "style.top":
		case "style.width":
		case "style.height":
		case "style.zIndex":
			NOLOHChanges[whatDistinctId][propertyString][0] = parseInt(newValue);
			break;
		case "style.visibility":
			NOLOHChanges[whatDistinctId][propertyString][0] = (newValue == "visible");
			break;
		case "style.display":
			NOLOHChanges[whatDistinctId][propertyString][0] = (newValue == "");
			break;
		default:
			NOLOHChanges[whatDistinctId][propertyString][0] = newValue;
	}
}

function ScrollState(id)
{
	var obj = document.getElementById(id);
	ChangeAndSave(id,"scrollLeft",obj.scrollLeft);
	ChangeAndSave(id,"scrollTop",obj.scrollTop);
}

function BodyScrollState()
{
	var X = document.documentElement.scrollLeft+1;
	var Y = document.documentElement.scrollTop+1;
	var loadImg = document.getElementById(_NLoadImg);
	loadImg.style.left = X+"px";
	loadImg.style.top = Y+"px";	
	var loadLbl = document.getElementById(_NLoadLbl);
	loadLbl.style.left = X+30+"px";
	loadLbl.style.top = Y+3+"px";
}

function AddOptionAndSave(id, option)
{
	var tempObj = document.getElementById(id);
	tempObj.options.add(option);
	_NSave(id, "options", ImplodeOptions(tempObj.options));
}

function RemoveOptionAndSave(id, index)
{
	var tempObj = document.getElementById(id);
	tempObj.remove(index);
	_NSave(id, "options", ImplodeOptions(tempObj.options));
}

function RadioButtonSave(id)
{
	var radio = document.getElementById(id);
	var radioGroup = document.getElementsByName(radio.name);
	for(var i=0; i < radioGroup.length; i++)
		_NSave(radioGroup[i].id, "checked", radioGroup[i].id == id);
}

function _NSetP(id, nameValuePairs)
{
	var i = 0;
	var obj = document.getElementById(id);
	while(i<nameValuePairs.length)
		NOLOHChangeByObj(obj, nameValuePairs[i++], nameValuePairs[i++]);
}

function _NAdd(addTo, tag, nameValuePairs)
{
	var elt = document.createElement(tag);
	elt.style.position = "absolute";
	var i = 0;
	while(i<nameValuePairs.length)
		NOLOHChangeByObj(elt, nameValuePairs[i++], nameValuePairs[i++]);
	var eltstyle = elt.style;
	/*if(eltstyle.background != "" && (eltstyle.filter == "" || eltstyle.filter == "alpha(opacity=100)"))
		AddSelectFix(elt, eltstyle);*/
	document.getElementById(addTo).appendChild(elt);
	if(eltstyle.background != "" && (eltstyle.filter == "" || eltstyle.filter == "alpha(opacity=100)"))
		AddSelectFix(elt, eltstyle);
	SaveControl(elt.id);
}

function _NRem(id)
{
	var ele = document.getElementById(id);
	ele.parentNode.removeChild(ele);
	document.getElementById("Graveyard").appendChild(ele);
	if(ele.SelectFix != null)
		_NRem(id+"_SF");
}

function _NRes(id, parentId)
{
	var ele = document.getElementById(id);
	document.getElementById("Graveyard").removeChild(ele);
	document.getElementById(parentId).appendChild(ele);
	if(ele.SelectFix != null)
		_NRes(id+"_SF", "N1");
}

function _NAsc(id)
{
	var ele = document.getElementById(id);
	ele.parentNode.removeChild(ele);
	if(ele.SelectFix != null)
		_NAsc(id+"_SF");
}

function GetChanges()
{
	var changes = "", distinctId, property;
	for(distinctId in NOLOHChanges)
		for(property in NOLOHChanges[distinctId])
			if(NOLOHChanges[distinctId][property][0] != SavedControls[distinctId][property])
			{
				SavedControls[distinctId][property] = NOLOHChanges[distinctId][property][0];
				changes += distinctId + "~d1~" + ConversionArray[property] + "~d1~" + NOLOHChanges[distinctId][property][0] + "~d0~";
				delete NOLOHChanges[distinctId][property];
			}
	return changes.substring(0,changes.length-4);
}

function processReqChange()
{
	var ready=req.readyState;
	var data=null;
	if (ready==4)
	{
   		var response = req.responseText.split("/*~NScript~*/", 2);
   		if(response[0] != "")
   		{
	   		var s = document.createElement("SCRIPT");
			s.type = "text/javascript";
			s.text = response[0];
			document.getElementsByTagName('head')[0].appendChild(s);
   		}
		eval(response[1]);
		document.getElementById(_NLoadImg).style.visibility = "hidden";
		document.getElementById(_NLoadLbl).style.visibility = "hidden";
		document.body.NOLOHPostingBack = false;
	}
}

function PostBack(EventType, ID)
{
	if(!document.body.NOLOHPostingBack)
	{
		document.body.NOLOHPostingBack = true;
		var str = "NOLOHClientChanges="+GetChanges()+"&NOLOHServerEvent="+EventType+"@"+ID+"&NOLOHVisit="+ ++NOLOHVisit;
		if(window.event != null)
			str += "&NOLOHMouseX="+(window.event.clientX+document.documentElement.scrollLeft)+
				"&NOLOHMouseY="+(window.event.clientY+document.documentElement.scrollTop);
		if(NOLOHKey != null)
		{
			str += "&NOLOHKey="+NOLOHKey;
			NOLOHKey = null;
		}
		if(NOLOHCaught.length != 0)
			str += "&NOLOHCaught="+NOLOHCaught.join(",");
	    req = new ActiveXObject("Microsoft.XMLHTTP");
		document.getElementById(_NLoadImg).style.visibility = "visible";
		document.getElementById(_NLoadLbl).style.visibility = "visible";
	    req.onreadystatechange = processReqChange;
	    req.open("POST", document.URL.split("#", 1)[0], true);
	    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	    req.send(str);
	}
}

function ReadyBox(id)
{
	if(NOLOHUpload.FileUploadObjIds.length > 0)
	{
		document.getElementById(id).UploadComplete = true;
		for(var i=0; i<NOLOHUpload.FileUploadObjIds.length; i++)
			if(document.getElementById(NOLOHUpload.FileUploadObjIds[i]).UploadComplete == false)
				return;
		PostBack(NOLOHUpload.EventType, NOLOHUpload.ID);
	}
}

function PostBackWithUpload(EventType, ID, FileUploadObjIds)
{
	NOLOHUpload.EventType = EventType;
	NOLOHUpload.ID = ID;
	NOLOHUpload.FileUploadObjIds = FileUploadObjIds;
	for(var i=0; i<FileUploadObjIds.length; i++)
	{
		iFrame = document.getElementById(FileUploadObjIds[i]);
		iFrame.UploadComplete = false;
		iFrame.contentWindow.document.getElementById("frm").submit();
	}
}

function ImplodeOptions(OptionsArray)
{
	var tempString ="";
	for(var i=0; i<OptionsArray.length; i++)
	{
		tempString += OptionsArray[i].value + "~d2~";
		tempString += OptionsArray[i].text + "~d3~";
	}
	
    tempString = tempString.substring(0,tempString.length-4);
	return tempString;
}

function ImplodeSelectedIndices(OptionsArray)
{
	var retString = "";
	if(OptionsArray != null)
		for(var i=0; i < OptionsArray.length; i++)
			if(OptionsArray[i].selected)
				retString += i + "~d2~";
	retString = retString.substring(0,retString.length-4);
	return retString;
}