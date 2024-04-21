function validateLogin() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var errorMessage = document.getElementById('error-message');

    // authentication logic
    if (username === 'user' && password === 'password') {
        // Successful login
        errorMessage.textContent = '';
        window.location.href='blogspot.html'
        alert('Login successful!');
    } else {
        // Failed login
        errorMessage.textContent = 'Invalid username or password. Please try again.';
    }
}
document.addEventListener('DOMContentLoaded', function () {
    // Fetch existing comments when the page loads
    fetchComments();

    // Function to fetch and display existing comments
    function fetchComments() {
        var xhr = new XMLHttpRequest();

        // Configure the request
        xhr.open('GET', 'server.php', true);

        // Set up a callback function to handle the response
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    // Successfully fetched comments
                    var existingComments = JSON.parse(xhr.responseText);
                    // Check for potential XSS in existing comments
                existingComments.forEach(function (comment) {
                    if (detectXSS(comment.text)) {
                        // Notify the user about potential XSS
                        alert('!! ALERT !! Existing comment contains a potential XSS payload. Viewer discretion is advised.');
                    }
                });

                    // Update the UI with existing comments
                    displayComments(existingComments);
                } else {
                    // Handle errors
                    console.error('Error fetching comments:', xhr.statusText);
                }
            }
        };

        // Send the request
        xhr.send();
    }


    // Function to display comments on the page
    function displayComments(comments) {
        var commentList = document.getElementById('commentList');

        // Clear existing comments on the page
        commentList.innerHTML = '';

        // Render each comment on the page
        comments.forEach(function (comment) {
            var commentItem = document.createElement('li');
            commentItem.className = 'comment';
            commentItem.innerHTML = '<strong>' + comment.name + ':</strong> <p>' + comment.text + '</p>';
            commentList.appendChild(commentItem);
        });
    }

    function addComment() {
        var nameInput = document.getElementById('commentName');
        var textInput = document.getElementById('commentText');
        var commentList = document.getElementById('commentList');
    
        var name = nameInput.value.trim();
        var text = textInput.value.trim();
        // Escape HTML characters in the comment text
        var escapedText = escapeHTML(text);
    
        // Clear the form fields
        nameInput.value = '';
        textInput.value = '';
    
        // Check for potential XSS
        if (detectXSS(text)) {
            // Notify the user about potential XSS
            alert('!! ALERT !! This comment may contain a potential XSS payload. Viewer discretion is advised.');
        }
    
    
        var comment = document.createElement('li');
        comment.className = 'comment';
        var commentText = document.createElement('p');
        commentText.textContent = text; 
        comment.innerHTML = '<strong>' + name + ':</strong> ';
        comment.appendChild(commentText);
        commentList.appendChild(comment);
    
        // Clear the form fields
        nameInput.value = '';
        textInput.value = '';
    
        var xhr = new XMLHttpRequest();
    
        // Configure the request
        xhr.open('POST', 'server.php', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
    
        //callback function to handle the response
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 201) {
                    // Successfully added comment
                    var addedComment = JSON.parse(xhr.responseText);
    
                    // Fetch and display updated comments
                    fetchComments();
                } else {
                    // Handle errors
                    console.error('Error adding comment:', xhr.statusText);
                }
            }
        };
    
        // Create a JSON object with the comment data
        var newComment = {
            name: name,
            text: text
        };
    
        // Conversion of JSON object to a string and send the request
        xhr.send(JSON.stringify(newComment));
    }
    
    

    // Attach the addComment function to the button click event
    var addButton = document.getElementById('btnad');
    addButton.addEventListener('click', addComment);
});
function escapeHTML(input) {
    var escapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    };

    return input.replace(/[&<>"']/g, function (match) {
        return escapeMap[match];
    });
}
function detectXSS(input) {
    //list of potential XSS keywords and symbols
    var xssPatterns = [
        'script', 'onload', 'alert', 'img', 'src', 'javascript:',
        '<', '>', '&lt;', '&gt;', '(', ')', '{', '}', '[', ']', '=',
        '\'', '\"', '/', '\\', ';', ':', '.', '-', '_', '+', '*',
        '%', '@', '#', '&', '?', '|', '$', '^', '~', '`', '!'
    ];
    
    for (var i = 0; i < xssPatterns.length; i++) {
        if (input.toLowerCase().includes(xssPatterns[i])) {
            return true;
        }
    }

    return false;
}
