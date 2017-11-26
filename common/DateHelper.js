function DateHelper() {

}

DateHelper.formatUnderline = function(date) {
	var nYear = date.getFullYear();
	var nMonth = date.getMonth() + 1;
	var nDate = date.getDate();
	var nHours = date.getHours();
	var nMinutes = date.getMinutes();
	var nSeconds = date.getSeconds();

	return `${nYear}_${nMonth}_${nDate}_${nHours}_${nMinutes}_${nSeconds}`;
}

DateHelper.format = function(date) {
   var nYear = date.getFullYear();
   var nMonth = date.getMonth() + 1;
   var nDate = date.getDate();
   var nHours = date.getHours();
   var nMinutes = date.getMinutes();
   var nSeconds = date.getSeconds();

   var sMonth = zeroPad(nMonth, 2);
   var sDate = zeroPad(nDate, 2);
   var sHours = zeroPad(nHours, 2);
   var sMinutes = zeroPad(nMinutes, 2);
   var sSeconds = zeroPad(nSeconds, 2);

   return `${nYear}-${sMonth}-${sDate} ${sHours}:${sMinutes}:${sSeconds}`;
}

function zeroPad(num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}

module.exports = DateHelper;