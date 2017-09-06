$(function() {
	$.extend(WorkoutLog, {
		log: {
			workouts: [],

			setDefinitions: function() {
				let defs = WorkoutLog.definition.userDefinitions;
				let len = defs.length;
				let opts;
				for (let i = 0; i < len; i++) {
					opts += "<option value='" + defs[i].id +"'>" + defs[i].description + "</option>";
				}
				$("#log-definition").children().remove();
				$("#log-definition").append(opts);
			},
			setHistory: function() {
				let history = WorkoutLog.log.workouts;
				let len = history.length;
				let lis = "";
				for (let i = 0; i < len; i++) {
					lis += "<li class='list-group-item'>" + history[i].def + " - " + history[i].result + "</li>";
				}
				$("#history-list").children().remove();
				$("#history-list").append(lis);
			},
			create: function() {
				let itsLog = {
					desc: $("#log-description").val(),
					result: $("#log-result").val(),
					def: $("#log-description option:selected").text()
				};
				let postData = {log: itsLog};
				let logger = $.ajax({
					type: "POST",
					url: WorkoutLog.API_BASE + "log",
					data: JSON.stringify(postData),
					contentType: "application/json"
				});
				logger.done(function(data) {
					WorkoutLog.log.workouts.push(data);
				});
			},
			fetchAll: function() {
				let fetchDefs = $.ajax({
					type: "GET",
					url: WorkoutLog.API_BASE + "log",
					headers: {
						"authorization": window.localStorage.getItem("sessionToken")
						}
					})
					.done(function(data) {
						WorkoutLog.log.workouts = data;
					})
					.fail(function(err) {
						console.log(err);
					});
			}
		}
	});
	//click the button and create a log entry
	$("#log-save").on("click", WorkoutLog.log.create);
	if (window.localStorage.getItem("sessionToken")) {
		WorkoutLog.log.fetchAll();
	}
});