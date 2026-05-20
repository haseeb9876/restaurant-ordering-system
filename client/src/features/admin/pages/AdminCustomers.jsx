import { useEffect, useState } from "react"
import toast from "react-hot-toast"

import {
  createStaffUser,
  getUsers,
} from "../../../services/api"

import AdminLayout from "../layouts/AdminLayout"

function AdminCustomers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [staffForm, setStaffForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "STAFF",
  })

  const [creatingStaff, setCreatingStaff] = useState(false)

  const fetchUsers = async () => {
    try {
      setError("")

      const data = await getUsers()
      setUsers(data)
    } catch (error) {
      const message = error.message || "Failed to load users."

      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()

    const interval = setInterval(() => {
      fetchUsers()
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target

    setStaffForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCreateStaff = async (e) => {
    e.preventDefault()

    try {
      setCreatingStaff(true)

      await createStaffUser(staffForm)

      toast.success("Staff user created successfully.")

      setStaffForm({
        fullName: "",
        email: "",
        password: "",
        role: "STAFF",
      })

      fetchUsers()
    } catch (error) {
      toast.error(
        error.message || "Failed to create staff user."
      )
    } finally {
      setCreatingStaff(false)
    }
  }

  const customers = users.filter(
    (user) => user.role === "CUSTOMER"
  )

  const staffUsers = users.filter(
    (user) => user.role === "STAFF"
  )

  const adminUsers = users.filter(
    (user) => user.role === "ADMIN"
  )

  return (
    <AdminLayout>
      <main className="px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <p className="text-orange-500 font-semibold mb-3">
              Admin Dashboard
            </p>

            <h1 className="text-4xl md:text-5xl font-extrabold">
              Customers & Users
            </h1>
          </div>

          {loading && (
            <p className="text-gray-400">
              Loading users...
            </p>
          )}

          {error && (
            <p className="text-red-400 mb-6">
              {error}
            </p>
          )}

          {!loading && !error && (
            <>
              <div className="grid md:grid-cols-4 gap-6 mb-10">
                <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6">
                  <p className="text-gray-400 mb-3">
                    Total Users
                  </p>

                  <h2 className="text-4xl font-extrabold text-orange-500">
                    {users.length}
                  </h2>
                </div>

                <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6">
                  <p className="text-gray-400 mb-3">
                    Customers
                  </p>

                  <h2 className="text-4xl font-extrabold text-green-400">
                    {customers.length}
                  </h2>
                </div>

                <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6">
                  <p className="text-gray-400 mb-3">
                    Staff
                  </p>

                  <h2 className="text-4xl font-extrabold text-blue-400">
                    {staffUsers.length}
                  </h2>
                </div>

                <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6">
                  <p className="text-gray-400 mb-3">
                    Admins
                  </p>

                  <h2 className="text-4xl font-extrabold text-yellow-400">
                    {adminUsers.length}
                  </h2>
                </div>
              </div>

              <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6 mb-10">
                <h2 className="text-2xl font-bold mb-6">
                  Create Staff User
                </h2>

                <form
                  onSubmit={handleCreateStaff}
                  className="grid md:grid-cols-2 gap-5"
                >
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={staffForm.fullName}
                    onChange={handleChange}
                    required
                    className="bg-black border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-orange-500"
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={staffForm.email}
                    onChange={handleChange}
                    required
                    className="bg-black border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-orange-500"
                  />

                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={staffForm.password}
                    onChange={handleChange}
                    required
                    className="bg-black border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-orange-500"
                  />

                  <select
                    name="role"
                    value={staffForm.role}
                    onChange={handleChange}
                    className="bg-black border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-orange-500"
                  >
                    <option value="STAFF">
                      STAFF
                    </option>

                    <option value="ADMIN">
                      ADMIN
                    </option>
                  </select>

                  <button
                    type="submit"
                    disabled={creatingStaff}
                    className="md:col-span-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 py-4 rounded-full font-bold transition"
                  >
                    {creatingStaff
                      ? "Creating User..."
                      : "Create Staff User"}
                  </button>
                </form>
              </div>

              <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6 overflow-x-auto">
                <h2 className="text-2xl font-bold mb-6">
                  Registered Users
                </h2>

                {users.length === 0 ? (
                  <p className="text-gray-400">
                    No users found.
                  </p>
                ) : (
                  <table className="w-full min-w-[720px] text-left">
                    <thead>
                      <tr className="border-b border-white/10 text-gray-400">
                        <th className="py-4 pr-4">
                          Name
                        </th>

                        <th className="py-4 pr-4">
                          Email
                        </th>

                        <th className="py-4 pr-4">
                          Role
                        </th>

                        <th className="py-4 pr-4">
                          Joined
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {users.map((user) => (
                        <tr
                          key={user.id}
                          className="border-b border-white/5"
                        >
                          <td className="py-4 pr-4 font-semibold">
                            {user.fullName}
                          </td>

                          <td className="py-4 pr-4 text-gray-400">
                            {user.email}
                          </td>

                          <td className="py-4 pr-4">
                            <span className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm font-bold">
                              {user.role}
                            </span>
                          </td>

                          <td className="py-4 pr-4 text-gray-400">
                            {new Date(
                              user.createdAt
                            ).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </AdminLayout>
  )
}

export default AdminCustomers
