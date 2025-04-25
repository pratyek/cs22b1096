function calculate(){
    const dob=document.getElementById("dob").value;
    const dob2=document.getElementById("dob2").value;
    if(!dob){
        alert("Please select your date of birth");
        return;
    }
    const date=new Date(dob);
    const date2=new Date(dob2);
    let years=date2.getFullYear()-date.getFullYear();
    let month=date2.getMonth()-date.getMonth();
    let day=date2.getDate()-date.getDate();

    if(day<0 || month<0 || years<0){
        alert("Please select a valid birthday");
        return;
    }
    document.getElementById('age').innerText=`Your age is ${years} years, ${month} months and ${day} days  old`;
}