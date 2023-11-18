$(document).ready(function() {
    // Function to update the current time every second
    setInterval(function() {
        $('#current-time').text(dayjs().format('MMM D, YYYY h:mm:ss A'));
    }, 1000);

    // Function to sort projects by due date
    function sortProjects(projects) {
        return projects.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }

    // Function to get the CSS class based on project type
    function getProjectClass(type) {
        switch (type) {
            case 'College': return 'college';
            case 'Internship': return 'internship';
            case 'Extracurricular activities': return 'activities';
            default: return '';
        }
    }

    // Function to print project data to the page
    function printProjects() {
        var projects = sortProjects(JSON.parse(localStorage.getItem('projects')) || []);
        var tbody = $('#project-table-body');
        tbody.empty();

        projects.forEach(function(project, index) {
            var tr = $('<tr>').addClass(getProjectClass(project.type));
            var dueDate = dayjs(project.dueDate);
            var today = dayjs();

            if (project.status === 'done') {
                tr.css({
                    'background': 'linear-gradient(to left, #28a745, #6fda92)', // Apply green gradient for done projects
                    'color': '#000000'
                });
            } else {
                if (dueDate.isBefore(today)) {
                    tr.addClass('table-danger');
                } else if (dueDate.isSame(today, 'day')) {
                    tr.addClass('table-warning');
                }
            }

            tr.append('<td>' + project.name + '</td>');
            tr.append('<td>' + project.type + '</td>');
            tr.append('<td>' + dueDate.format('MMM D, YYYY') + '</td>');

            var deleteButton = $('<button>')
                .addClass('btn btn-danger btn-sm')
                .text('Delete')
                .data('index', index)
                .on('click', function() {
                    var projectIndex = $(this).data('index');
                    projects.splice(projectIndex, 1);
                    localStorage.setItem('projects', JSON.stringify(projects));
                    printProjects();
                });

            var doneButton = $('<button>')
                .addClass('btn btn-success btn-sm')
                .text('Done')
                .data('index', index)
                .on('click', function() {
                    projects[index].status = 'done'; // Update status to 'done'
                    localStorage.setItem('projects', JSON.stringify(projects)); // Save updated projects to local storage
                    printProjects(); // Reprint the projects
                });

            var td = $('<td>').append(deleteButton, ' ', doneButton);
            tr.append(td);

            tbody.append(tr);
        });
    }

    // Event listener for form submission
    $('#project-form').on('submit', function(e) {
        e.preventDefault();

        var projectName = $('#project-name').val();
        var projectType = $('#project-type').val();
        var projectDueDate = $('#project-due-date').val();

        var projectData = {
            name: projectName,
            type: projectType,
            dueDate: projectDueDate,
            status: 'pending' // Default status as 'pending'
        };

        var projects = JSON.parse(localStorage.getItem('projects')) || [];
        projects.push(projectData);
        localStorage.setItem('projects', JSON.stringify(projects));

        printProjects();
        $('#projectModal').modal('hide');
        $(this).trigger('reset');
    });

    printProjects();
});
