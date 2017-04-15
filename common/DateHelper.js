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

module.exports = DateHelper;