import React, {useState, useEffect} from 'react'

const API = process.env.REACT_APP_API;

function Users() {

    const [name, setName] =  useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [id, setId] = useState("");
    const [editing, setEditing] = useState(false);
    
    const [users, setUsers] = useState([]);

    const cleanFields = () =>{
      setName("");
      setEmail("");
      setPassword("");
    }

    const handleSubmit = async (e) => {
      e.preventDefault();

      if(!editing){
        /* Here we use post method to create user*/
        const res = await fetch(`${API}/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        });
        const data = res.json;
        console.log(data);
      } else {
        const res = await fetch(`${API}/user/${id}`,{
          method: 'PUT',
          headers: {
            'Content-Type':'application/json'
          },
          body: JSON.stringify({
            name,
            email,
            password
          }) 
        })
        const data = await res.json();
        console.log(data);
        setEditing(false);
        setId("");
      }

      cleanFields();
      await getUsers()
    };

    const getUsers = async () =>{
        const res = await fetch(`${API}/users`) /*fetch use get as default method*/
        const data = await res.json();
        setUsers(data)
    }

    const deleteUser = async (id) =>{
      const userResponse = window.confirm("Delete user?")
      if(userResponse) {
        const res = await fetch(`${API}/user/${id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        console.log(data);
        await getUsers();
      }
    }

    const editUser = async (id) =>{
      const res = await fetch(`${API}/user/${id}`);
      const data = await res.json();

      setEditing(true);
      setId(id);

      setName(data.name);
      setEmail(data.email);
      setPassword(data.password);
    }

    useEffect(() => {
        getUsers();
    },[])
    return (
      <div className="row">
        <div className="col-md-4">
          <form onSubmit={handleSubmit} className="card card-body">
            <div className="form-group">
              <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="form-control"
                placeholder="Name"
                autoFocus
              />
            </div>
            <div className="form-group mt-2">
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="form-control"
                placeholder="Email"
              />
            </div>
            <div className="form-group mt-2">
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="form-control"
                placeholder="Password"
              />
            </div>
            <div className="d-grid gap-2">
              <button className="btn btn-primary" type="submit">
                Crear
              </button>
            </div>
          </form>
        </div>
        <div className="col-md-6">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Password</th>
                <th>Operations</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.password}</td>
                  <td>
                    <div className="d-grid gap-1">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => editUser(user._id)}
                      >
                       {editing ? 'Update' : 'Create'}
                      </button>
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
}

export default Users
