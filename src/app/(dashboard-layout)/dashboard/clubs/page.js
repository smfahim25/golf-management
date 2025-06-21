"use client";
import React, { useState, useEffect } from "react";
import { Plus, Edit3, Trash2, MapPin, Calendar, X, Check } from "lucide-react";
import useClubStore from "@/stores/ClubStore";

const ClubManagementUI = () => {
  const {
    clubs,
    fetchClubs,
    createClub,
    updateClub,
    deleteClub,
    isLoading,
    error,
  } = useClubStore();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
  const [selectedClub, setSelectedClub] = useState(null);
  const [clubToDelete, setClubToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bays: [""],
  });

  useEffect(() => {
    fetchClubs();
  }, [fetchClubs]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const openModal = (mode, club = null) => {
    setModalMode(mode);
    setSelectedClub(club);
    if (mode === "edit" && club) {
      setFormData({
        name: club.name,
        bays: club.bays.length > 0 ? club.bays : [""],
      });
    } else {
      setFormData({
        name: "",
        bays: [""],
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedClub(null);
    setFormData({ name: "", bays: [""] });
    setIsSubmitting(false);
  };

  const openDeleteModal = (club) => {
    setClubToDelete(club);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setClubToDelete(null);
    setIsDeleting(false);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBayChange = (index, value) => {
    const newBays = [...formData.bays];
    newBays[index] = value;
    setFormData({
      ...formData,
      bays: newBays,
    });
  };

  const addBayInput = () => {
    setFormData({
      ...formData,
      bays: [...formData.bays, ""],
    });
  };

  const removeBayInput = (index) => {
    if (formData.bays.length > 1) {
      const newBays = formData.bays.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        bays: newBays,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const filteredBays = formData.bays.filter((bay) => bay.trim() !== "");

    const clubData = {
      name: formData.name,
      bays: filteredBays,
    };

    try {
      if (modalMode === "add") {
        await createClub(clubData);
      } else {
        await updateClub(selectedClub._id, clubData);
      }
      await fetchClubs();
      closeModal();
    } catch (err) {
      console.error("Failed to save club:", err);
    }
  };

  const handleDelete = async (clubId) => {
    try {
      await deleteClub(clubId);
      await fetchClubs();
    } catch (err) {
      console.error("Failed to delete club:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Club Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your clubs and their bays
              </p>
            </div>
            <button
              onClick={() => openModal("add")}
              className="bg-primary text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
            >
              <Plus size={20} />
              Add New Club
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Club Name
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Bays
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Created
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Updated
                  </th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-12">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-gray-600">
                          Loading clubs...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : clubs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-12">
                      <div className="text-gray-500">
                        <MapPin
                          size={48}
                          className="mx-auto mb-4 text-gray-300"
                        />
                        <p className="text-lg font-medium">No clubs found</p>
                        <p className="text-sm">
                          Get started by adding your first club
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  clubs.map((club) => (
                    <tr
                      key={club._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900">
                          {club.name}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-2">
                          {club.bays.map((bay, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200"
                            >
                              <MapPin size={14} className="mr-1" />
                              {bay}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center text-gray-600">
                          <Calendar size={16} className="mr-2" />
                          {formatDate(club.createdAt)}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center text-gray-600">
                          <Calendar size={16} className="mr-2" />
                          {formatDate(club.updatedAt)}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => openModal("edit", club)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Club"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button
                            onClick={() => openDeleteModal(club)}
                            disabled={isLoading}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete Club"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {modalMode === "add" ? "Add New Club" : "Edit Club"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Club Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter club name"
                  required
                />
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Bays
                  </label>
                  <button
                    type="button"
                    onClick={addBayInput}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    + Add Bay
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.bays.map((bay, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={bay}
                        onChange={(e) => handleBayChange(index, e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder={`Bay ${index + 1}`}
                      />
                      {formData.bays.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeBayInput(index)}
                          className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-3 bg-primary text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Check size={18} />
                  {modalMode === "add" ? "Create Club" : "Update Club"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && clubToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                <Trash2 size={24} className="text-red-600" />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Delete Club
              </h3>

              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete{" "}
                <strong>{clubToDelete.name}</strong>? This action cannot be
                undone and will also remove all associated bays.
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={18} />
                      Delete Club
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubManagementUI;
