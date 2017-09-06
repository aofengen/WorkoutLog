$(function() {
	$.extend(WorkoutLog, {
		log: {
			workouts: [],

			setDefinitions: function() {
				let defs = WorkoutLog.definition.userDefinitions;
				console.log(defs);
				let len = defs.length;
				console.log(len);
				let opts;
				for (let i = 0; i < len; i++) {
					opts += "<option value='" + defs[i].id +"'>" + defs[i].description + "</option>";
				}
				console.log(opts);
				$("#log-definition").children().remove();
				$("#log-definition").append(opts);
			},
			setHistory: function() {
				let history = WorkoutLog.log.workouts;
				let len = history.length;
				let lis = "";
				for (let i = 0; i < len; i++) {
					lis += "<li class='list-group-item'>" + 
					history[i].def + " - " +
					history[i].result + " " +
					//pass the log.id into the button's id attribute
					"<div class='pull-right'>" +
						"<button id='" + history[i].id + "' class='update'><b>U</b></button>" +
						"<button id='" + history[i].id + "' class='remove'><b>X</b></button>" +
					"</div></li>";
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
				console.log("hi");
				logger.done(function(data) {
					WorkoutLog.log.workouts.push(data);
					$("#log-description").val("");
					$("#log-result").val("");
					$('a[href="#history"]').tab("show");
				});
			},
			delete: function() {
				let thisLog = {
					//this is the button on the li
					//.attr(id) targets the value of the id attribute of button
					id: $(this).attr("id")
				};
				let deleteData = {log: thisLog};
				let deleteLog = $.ajax({
					type: "DELETE",
					url: WorkoutLog.API_BASE + "log",
					data: JSON.stringify(deleteData),
					contentType: "application/json"
				});
				//removes list item
				//references button then grabs closest li
				$(this).closest("li").remove();
				//deletes item out of workouts array
				for (var i = 0; i < WorkoutLog.log.workouts.length; i++) {
					if (WorkoutLog.log.workouts[i].id == thisLog.id) {
						WorkoutLog.log.workouts.splice(i, 1);
					}
				}
				deleteLog.fail(function() {
					console.log("nope. you didn't delete it.");
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
	//click the button and create or delete a log entry
	$("#log-save").on("click", WorkoutLog.log.create);
	$("#history-list").delegate('.remove', 'click', WorkoutLog.log.delete);
	if (window.localStorage.getItem("sessionToken")) {
		WorkoutLog.log.fetchAll();
	}
});