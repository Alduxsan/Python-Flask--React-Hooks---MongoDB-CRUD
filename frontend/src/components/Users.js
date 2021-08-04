import React, {useState} from 'react'

function Users() {

    const [name, setName] =  useState("")

    const handleSubmit = (e) => {
    console.log(e)
    }

    return (
        <div className="row">
            <div className="col-md-4">
                <form onSubmit={handleSubmit} className="card card-body">
                    <div className="form-group">
                        <input 
                        type="text" 
                        onChange={setName(e.target.value)} 
                        value={name}
                        className="form-control"
                        placeholder="Name"
                        autoFocus />
                    </div>
                </form>
            </div>
            <div className="col md-8">

            </div>
        </div>
    )
}

export default Users
