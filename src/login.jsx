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
                        <textarea> UserName</textarea>
                    </ul>
                    <ul>
                        <textarea> password</textarea>
                    </ul>
                    <ul>
                        <textarea> email</textarea>
                    </ul>
                <button>signup</button>
            </div>

        )
        
    
}

export default Loginscreen