import { useEffect, useMemo, useState } from "react"
import toast from "react-hot-toast"

import {
  createStaffUser,
  deleteUser,
  getUsers,
  updateUserRole,
} from "../../../services/api"

import AdminLayout from "../layouts/AdminLayout"

function getRoleClass(role) {
  if (role === "ADMIN") return "bg-yellow-500/20 text-yellow-400"
  if (role === "STAFF") return "bg-blue-500/20 text-blue-400"
  if (role === "CUSTOMER") return "bg-green-500/20 text-green-400"

  return "bg-white/10 text-gray-300"
}

const roles = ["CUSTOMER", "STAFF", "ADMIN"]

function AdminCustomers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("ALL")

  const [creatingStaff, setCreatingStaff] = useState(false)
  const [updatingUserId, setUpdatingUserId] = useState(null)
  const [deletingUserId, setDeletingUserId] = useState(null)

  const [staffForm, setStaffForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "STAFF",
  })

  const currentUser = JSON.parse(localStorage.getItem("user"))

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

  const customers = users.filter((user) => user.role === "CUSTOMER")
  const staffUsers = users.filter((user) => user.role === "STAFF")
  const adminUsers = users.filter((user) => user.role === "ADMIN")

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return users.filter((user) => {
      const matchesSearch =
        !normalizedSearch ||
        [user.fullName, user.email, user.role]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(normalizedSearch)
          )

      const matchesRole =
        roleFilter === "ALL" || user.role === roleFilter

      return matchesSearch && matchesRole
    })
  }, [users, searchTerm, roleFilter])

  const hasActiveFilters =
    searchTerm || roleFilter !== "ALL"

  const clearFilters = () => {
    setSearchTerm("")
    setRoleFilter("ALL")
  }

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

      toast.success("User created successfully.")

      setStaffForm({
        fullName: "",
        email: "",
        password: "",
        role: "STAFF",
      })

      fetchUsers()
    } catch (error) {
      toast.error(error.message || "Failed to create user.")
    } finally {
      setCreatingStaff(false)
    }
  }

  const handleRoleUpdate = async (userId, role) => {
    const confirmed = window.confirm(
      `Change user role to ${role}?`
    )

    if (!confirmed) {
      return
    }

    try {
      setUpdatingUserId(userId)

      const updatedUser = await updateUserRole(userId, role)

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? updatedUser : user
        )
      )

      toast.success("User role updated successfully.")
    } catch (error) {
      toast.error(error.message || "Failed to update role.")
    } finally {
      setUpdatingUserId(null)
    }
  }

  const handleDeleteUser = async (user) => {
    const confirmed = window.confirm(
      `Delete ${user.fullName}?`
    )

    if (!confirmed) {
      return
    }

    try {
      setDeletingUserId(user.id)

      await deleteUser(user.id)

      setUsers((prevUsers) =>
        prevUsers.filter((u) => u.id !== user.id)
      )

      toast.success("User deleted successfully.")
    } catch (error) {
      toast.error(error.message || "Failed to delete user.")
    } finally {
      setDeletingUserId(null)
    }
  }

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

            <p className="text-gray-400 mt-3 max-w-3xl">
              Securely manage customer, staff, and admin accounts.
            </p>
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
                  <p className="text-gray-400 mb-3">Total Users</p>

                  <h2 className="text-4xl font-extrabold text-orange-500">
                    {users.length}
                  </h2>
                </div>

                <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6">
                  <p className="text-gray-400 mb-3">Customers</p>

                  <h2 className="text-4xl font-extrabold text-green-400">
                    {customers.length}
                  </h2>
                </div>

                <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6">
                  <p className="text-gray-400 mb-3">Staff</p>

                  <h2 className="text-4xl font-extrabold text-blue-400">
                    {staffUsers.length}
                  </h2>
                </div>

                <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6">
                  <p className="text-gray-400 mb-3">Admins</p>

                  <h2 className="text-4xl font-extrabold text-yellow-400">
                    {adminUsers.length}
                  </h2>
                </div>
              </div>

              <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6 mb-10">
                <h2 className="text-2xl font-bold mb-6">
                  Create Staff/Admin User
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
                    minLength="6"
                    className="bg-black border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-orange-500"
                  />

                  <select
                    name="role"
                    value={staffForm.role}
                    onChange={handleChange}
                    className="bg-black border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-orange-500"
                  >
                    <option value="STAFF">STAFF</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>

                  <button
                    type="submit"
                    disabled={creatingStaff}
                    className="md:col-span-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 py-4 rounded-full font-bold transition"
                  >
                    {creatingStaff ? "Creating..." : "Create User"}
                  </button>
                </form>
              </div>

              <section className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6 mb-8">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-400 mb-2">
                      Search Users
                    </label>

                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Search by name, email, or role"
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Role Filter
                    </label>

                    <select
                      value={roleFilter}
                      onChange={(event) => setRoleFilter(event.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                    >
                      <option value="ALL">All Roles</option>
                      <option value="CUSTOMER">CUSTOMER</option>
                      <option value="STAFF">STAFF</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </div>
                </div>

                <div className="mt-5 flex justify-between items-center">
                  <p className="text-gray-400 text-sm">
                    Showing{" "}
                    <span className="text-orange-500 font-bold">
                      {filteredUsers.length}
                    </span>{" "}
                    of{" "}
                    <span className="text-white font-bold">
                      {users.length}
                    </span>{" "}
                    users
                  </p>

                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="border border-white/10 hover:border-orange-500 px-5 py-2 rounded-full font-bold transition"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </section>

              <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6 overflow-x-auto">
                <table className="w-full min-w-[1000px] text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400">
                      <th className="py-4 pr-4">Name</th>
                      <th className="py-4 pr-4">Email</th>
                      <th className="py-4 pr-4">Role</th>
                      <th className="py-4 pr-4">Joined</th>
                      <th className="py-4 pr-4">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-white/5"
                      >
                        <td className="py-4 pr-4 font-semibold">
                          {user.fullName}

                          {currentUser?.id === user.id && (
                            <span className="ml-2 text-xs text-orange-500">
                              (You)
                            </span>
                          )}
                        </td>

                        <td className="py-4 pr-4 text-gray-400">
                          {user.email}
                        </td>

                        <td className="py-4 pr-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-bold ${getRoleClass(
                              user.role
                            )}`}
                          >
                            {user.role}
                          </span>
                        </td>

                        <td className="py-4 pr-4 text-gray-400">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>

                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-3">
                            <select
                              value={user.role}
                              onChange={(event) =>
                                handleRoleUpdate(
                                  user.id,
                                  event.target.value
                                )
                              }
                              disabled={
                                updatingUserId === user.id
                              }
                              className="bg-black border border-white/10 rounded-xl px-3 py-2 outline-none focus:border-orange-500"
                            >
                              {roles.map((role) => (
                                <option
                                  key={role}
                                  value={role}
                                  className="bg-black"
                                >
                                  {role}
                                </option>
                              ))}
                            </select>

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteUser(user)
                              }
                              disabled={
                                deletingUserId === user.id
                              }
                              className="border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white px-4 py-2 rounded-full font-bold transition disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                              {deletingUserId === user.id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </main>
    </AdminLayout>
  )
}

export default AdminCustomers
