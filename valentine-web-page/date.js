function showDate() {
    const inputDate = document.getElementById("dateInput").value;

    if (!inputDate) {
        document.getElementById("dateDisplay").innerHTML = "You haven't chosen the date yet :( "

    } else {

        const date = new Date(inputDate);

        // Format the date
        const options = {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        
        const formattedDate = date.toLocaleString('en-GB', options).replace(',', '');
    
        // Display the formatted date
        document.getElementById("dateDisplay").innerText = `Great! Our date is set for: ${formattedDate}`;
    }
}