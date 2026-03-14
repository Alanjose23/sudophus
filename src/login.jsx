import {useState} from "react"


function Loginscreen() {
    // var [users, setUsers] = useState([]);


    // const addUsers() = async(){
    // user setup to db
    // }

    return (

            <div style = {{textAlign: "center"}}>
                <h2>User Profile Creation</h2>
                    <ul>
                        <textarea value = {t2}> UserName</textarea>
                    </ul>
                    <ul>
                        <textarea value = {t3}> password</textarea>
                    </ul>
                    <ul>
                        <textarea value = {t4}> email</textarea>
                    </ul>
                <button>signup</button>
            </div>

        )
        
    
}

export default Loginscreen