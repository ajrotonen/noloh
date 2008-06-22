function LastMonth(id)
{
	var calObj = _N(id);
	_NSetProperty(id, "calViewDate.setMonth", calObj.calViewDate.getMonth()-1);
	_NSetProperty(id, "calViewDate.setFullYear", calObj.calViewDate.getFullYear());
	PrintCal(id);
}

function NextMonth(id)
{
	var calObj = _N(id);
	_NSetProperty(id, "calViewDate.setMonth", calObj.calViewDate.getMonth()+1);
	_NSetProperty(id, "calViewDate.setFullYear", calObj.calViewDate.getFullYear());
	PrintCal(id);
}

function LastYear(id)
{
	var calObj = _N(id);
	_NSetProperty(id, "calViewDate.setFullYear", calObj.calViewDate.getFullYear()-1);
	PrintCal(id);
}

function NextYear(id)
{
	var calObj = _N(id);
	_NSetProperty(id, "calViewDate.setFullYear", calObj.calViewDate.getFullYear()+1);
	PrintCal(id);
}

function CalSelectDate(event, calid)
{
	var cal = _N(calid);
	var lab = event.target;
	_N(cal.SelectedLabelId).style.fontWeight = "normal";
	cal.SelectedLabelId = lab.id;
	_NSetProperty(calid, "calSelectDate.setDate", lab.innerHTML);
	_NSetProperty(calid, "calSelectDate.setMonth", cal.calViewDate.getMonth());
	_NSetProperty(calid, "calSelectDate.setFullYear", cal.calViewDate.getFullYear());
	lab.style.fontWeight = "bold";
	if(cal.onchange != null)
		cal.onchange.call();
}

function PickerSelectDate(calid, comboid, format)
{
    ShowDatePicker(calid, comboid, format);
	_N(calid).style.display = 'none';
}

function ShowDatePicker(calid, comboid, format)
{
	var ds = GetDateString(calid,format);
	_N(comboid).options[0] = new Option(ds,ds);
}

function ShowCalendar(id, ViewMonth, ViewYear, SelectDate, SelectMonth, SelectYear)
{
	var calObj = _N(id);
	calObj.calSelectDate = new Date();
	calObj.calViewDate = new Date();
	calObj.calViewDate.setFullYear(ViewYear, ViewMonth, 1);
	calObj.calSelectDate.setFullYear(SelectYear, SelectMonth, SelectDate);
	SaveControl(id);
	PrintCal(id);
}

function PrintCal(id)
{
	var ubound, date, i, Obj;
	var cal = _N(id);
	var Month = cal.calViewDate.getMonth();
	var Year = cal.calViewDate.getFullYear();
	id = parseInt(id.replace("N", ""));
	var Offset = id + 13;
	cal.calViewDate.setDate(1);
	_N("N" + (id+1)).innerHTML = GetShortMonth(cal.calViewDate) + " " + cal.calViewDate.getFullYear();
	ubound = cal.calViewDate.getDay()+Offset;
	for(i = Offset; i < ubound; i++)
	{
		Obj = _N("N" + i);
		Obj.innerHTML = "";
	}
	ubound = Offset+42;
	for(i = cal.calViewDate.getDay() + Offset; i < ubound; i++)
	{
		Obj = _N("N" + i);
		if(Month == cal.calViewDate.getMonth())
		{
			Obj.innerHTML = cal.calViewDate.getDate();
			if(cal.calViewDate.getDate()==cal.calSelectDate.getDate() && cal.calViewDate.getMonth()==cal.calSelectDate.getMonth()
			 														  && cal.calViewDate.getFullYear()==cal.calSelectDate.getFullYear())
			{
				Obj.style.fontWeight = "bold";
				cal.SelectedLabelId = Obj.id;
			}
			else
				Obj.style.fontWeight = "normal";
		}
		else
			Obj.innerHTML = "";
		cal.calViewDate.setDate(cal.calViewDate.getDate()+1);
	}
	cal.calViewDate.setFullYear(Year, Month);
}

function GetFullDay(theDate)
{
	var weekday = new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");
	return weekday[theDate.getDay()];
}

function GetShortDay(theDate)
{
	var day = GetFullDay(theDate);
	if(day == "Thursday")
		return day.substring(0, 4);
	return day.substring(0, 3);
}

function GetFullMonth(theDate)
{
	var fullmonth = new Array("January","February","March","April","May","June",
			"July","August","September","October","November","December");
	return fullmonth[theDate.getMonth()];
}

function GetMonthWithZeros(theDate)
{
	var month = theDate.getMonth();
	if(month <= 9)
		return "0"+(month+1).toString();
	return month;
}

function GetDateWithZeros(theDate)
{
	if(theDate.getDate() <= 9)
		return "0" + theDate.getDate().toString();
	return theDate.getDate();
}

function GetShortMonth(theDate)
{
	var month = GetFullMonth(theDate);
	if(month == "September")
		return month.substring(0, 4);
	return month.substring(0, 3);
}

function GetSuffixToNumericalDate(theDate)
{
	var date = theDate.getDate();
	if(date == 1 || date == 21 || date == 31)
		return date.toString() + "st";
	else
	if(date == 2 || date == 22)
		return date.toString() + "nd";
	else
	if(date == 3 || date == 23)
		return date.toString() + "rd";
	return date.toString() + "th";
}

function GetYear(theDate)
{
	return theDate.getFullYear().toString().substring(2,4);
}

function ChangeDateLetter(letter, theDate)
{
	switch(letter)
	{
		case "d":	return GetDateWithZeros(theDate);
		case "D":	return GetShortDay(theDate);
		case "F":	return GetFullMonth(theDate);
		case "j":	return theDate.getDate();
		case "l":	return GetFullDay(theDate);
		case "m":	return GetMonthWithZeros(theDate);
		case "M":	return GetShortMonth(theDate);
		case "n":	return theDate.getMonth() + 1;
		case "w":	return theDate.getDay() + 1;	
		case "y":	return GetYear(theDate);
		case "Y":	return theDate.getFullYear();
		case "S":	return GetSuffixToNumericalDate(theDate);
	}
	return letter;
}

function GetDateString(calid, dateStr)
{
	var d = _N(calid).calSelectDate;
	var finalStr = "";
	for(var i = 0; i < dateStr.length; i++)
		finalStr += ChangeDateLetter(dateStr.substring(i, i+1), d);
	return finalStr;
}

_NOpenedCalendar = null;

function TogglePull(calId, comboId, event)
{
	var Obj=_N(calId);
	if(Obj.style.display == 'none')
	{
		Obj.style.display = '';
		_NOpenedCalendar = calId;
		window.addEventListener("click", CalendarClickOff, false);
		event.stopPropagation();
	}
	_N(comboId).blur();
}

function CalendarClickOff()
{
	_N(_NOpenedCalendar).style.display = 'none';
	_NOpenedCalendar = null;
	window.removeEventListener("click", CalendarClickOff, false);
}