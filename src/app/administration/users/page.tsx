"use client";

import AddEditUserModal from "@/components/modals/AddEditUsersModal";
import { DeleteModal } from "@/components/modals/DeleteModal";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

interface User {
  id: string;
  name: string;
  address: string;
  phone: string;
  rol: string;
  email: string;
  profile: Profile;
  password?: string;
}

interface Profile {
  address: string;
  birthday: string;
  dni: string;
  id: string;
  phone: string;
  profileImage: string;
  userId: string
}

const Page = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [modal, setModal] = useState(false);
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [deleteModal, setDeleteModal] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const URL = process.env.NEXT_PUBLIC_API_URL;

  const defaultImage = "/img/default-profile.jpg";

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${URL}/users/admin/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUsers(data.data);
    } catch (error) {
      console.error("No se pudo obtener los datos", error);
    }
  };


  useEffect(() => {
    fetchUsers();
  }, [deleteModal]);

  const openAddModal = () => {
    setSelectedUser(null);
    setModal(true);
  };


  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setModal(true);
    setIsEditing(true)
  };

  const commonStyle = "py-2 px-3 border-b border-neutral-300 flex items-center font-semibold";

  const filteredUsers =
  search !== ""
      ? users.filter((user) =>
        user.name
              .toLowerCase()
              .trim()
              .includes(search.toLowerCase().trim())
      )
      : users;


  return (
    <section className="relative">
      {modal && (
        <AddEditUserModal
          setModal={setModal}
          user={selectedUser}
          isEditing={isEditing}
        />
      )}
      {deleteModal && (
        <DeleteModal
          setDeleteModal={setDeleteModal}
          nombre={selectedUser?.name}
          elemento="usuario"
          itemId={selectedUser?.id || ""}
          ruta="/users/delete/"
        />
      )}

      <div className="flex justify-between">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white py-2 px-4 my-2 rounded-md border-2 border-neutral-400 outline-none w-[25rem]"
          type="search"
          placeholder="Buscar usuarios..."
        />
        <button
          onClick={openAddModal}
          className="bg-white py-2 px-4 my-2 rounded-md border-2 border-neutral-400 hover:border-black duration-200"
        >
          Agregar Usuario
        </button>
      </div>

      <div>
        <section className="flex flex-col rounded-md overflow-hidden">
          <article className="bg-gray-800 text-white flex ">

            <div className={`${commonStyle} w-1/12`}>Foto</div>
            <div className={`${commonStyle} w-3/12`}>Nombre</div>
            <div className={`${commonStyle} w-4/12`}>Email</div>
            <div className={`${commonStyle} w-2/12`}>Rol</div>
            <div className={`${commonStyle} w-2/12 justify-end`}>Opciones</div>
          </article>

          {filteredUsers.map((user, i) => (
            <article key={i} className="bg-white flex">
              <div className={`${commonStyle} w-1/12`}>
                <img
                  src={user?.profile?.profileImage || defaultImage}
                  className=" h-12 rounded-full"
                />
              </div>
              <div className={`${commonStyle} w-3/12`}>
                {user.name}
              </div>
              <div className={`${commonStyle} w-4/12`}>
                {user.email}
              </div>

              <div className={`${commonStyle} w-2/12`}>
                {user.rol}
              </div>
              <div className={`${commonStyle} flex w-2/12 gap-6 justify-end`}>
                <button onClick={() => openEditModal(user)}>
                  <FaEdit />
                </button>
                <button onClick={() => {
                  setSelectedUser(user);
                  setDeleteModal(true);
                }}>
                  <RiDeleteBin6Line color="red" />
                </button>
              </div>
            </article>
          ))}
        </section>
      </div>
    </section>
  );
};

export default Page;
