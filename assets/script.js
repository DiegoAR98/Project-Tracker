$(document).ready(function() {
    // Function to update the current time every second
    setInterval(function() {
        $('#current-time').text(dayjs().format('MMM D, YYYY h:mm:ss A'));
    }, 1000);

    // Function to print project data to the page
    function printProjects() {
        var projects = JSON.parse(localStorage.getItem('projects')) || [];
        var tbody = $('#project-table-body');
        tbody.empty(); // Clear the table body

        projects.forEach(function(project, index) {
            var tr = $('<tr>');
            var dueDate = dayjs(project.dueDate);
            var today = dayjs();

            // Apply class based on due date status
            if (dueDate.isBefore(today)) {
                tr.addClass('table-danger'); // Past due date
            } else if (dueDate.isSame(today, 'day')) {
                tr.addClass('table-warning'); // Due today
            }

            // Append project details to the row
            tr.append('<td>' + project.name + '</td>');
            tr.append('<td>' + project.type + '</td>');
            tr.append('<td>' + dueDate.format('MMM D, YYYY') + '</td>');

            // Create a delete button
            var deleteButton = $('<button>')
                .addClass('btn btn-danger btn-sm')
                .text('Delete')
                .data('index', index) // Store the index of the project
                .on('click', function() {
                    var projectIndex = $(this).data('index');
                    projects.splice(projectIndex, 1); // Remove the project
                    localStorage.setItem('projects', JSON.stringify(projects)); // Update localStorage
                    printProjects(); // Reprint the projects
                });

            // Append the delete button to the row
            var td = $('<td>').append(deleteButton);
            tr.append(td);

            // Append the row to the table body
            tbody.append(tr);
        });
    }

    // Event listener for form submission
    $('#project-form').on('submit', function(e) {
        e.preventDefault();

        // Capture form data
        var projectName = $('#project-name').val();
        var projectType = $('#project-type').val();
        var projectDueDate = $('#project-due-date').val();

        // Store the project data
        var projectData = {
            name: projectName,
            type: projectType,
            dueDate: projectDueDate
        };

        // Retrieve the current list of projects and add the new project
        var projects = JSON.parse(localStorage.getItem('projects')) || [];
        projects.push(projectData);
        localStorage.setItem('projects', JSON.stringify(projects));

        // Print the projects and reset the form
        printProjects();
        $('#projectModal').modal('hide');
        $(this).trigger('reset');
    });

    // Print projects on page load
    printProjects();
});
