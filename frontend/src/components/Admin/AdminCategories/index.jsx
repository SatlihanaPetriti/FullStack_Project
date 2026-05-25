import { useRef, useState } from "react";
import { Search, Plus, X, Tag, Layers } from "lucide-react";

import { useCategoryContext } from "../../../Context/Category";
import { useProductContext } from "../../../Context/Product";

import CategoriesTable from "./CategoriesTable";
import CategoryModal from "./CategoryModal";

import "./index.css";

const EMPTY_FORM = {
    name: "",
    imageFile: null,
    imagePreview: null,
};

const CategoriesPage = () => {
    const { categories, loading, error, createCategory, updateCategory, deleteCategory } = useCategoryContext();
    const { products = [] } = useProductContext();

    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingCat, setEditingCat] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const fileInputRef = useRef(null);

    const getCount = (category) => {
        return products.filter((product) => {
            return (
                product.category?.id === category.id ||
                product.category_id === category.id
            );
        }).length;
    };

    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(search.toLowerCase())
    );

    const stats = {
        totalProducts: products.length,
        emptyCategories: categories.filter((category) => getCount(category) === 0).length,
    };

    const activeCategories = categories.length - stats.emptyCategories;

    const resetForm = () => {
        setForm(EMPTY_FORM);
        setEditingCat(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const openAdd = () => {
        resetForm();
        setShowModal(true);
    };

    const openEdit = (category) => {
        setEditingCat(category);

        setForm({
            name: category.name,
            imageFile: null,
            imagePreview: category.image_url ?? null,
        });

        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        resetForm();
    };

    const updateFormName = (value) => {
        setForm((prev) => ({
            ...prev,
            name: value,
        }));
    };

    const updateImage = (file) => {
        if (!file) return;

        setForm((prev) => ({
            ...prev,
            imageFile: file,
            imagePreview: URL.createObjectURL(file),
        }));
    };

    const removeImage = () => {
        setForm((prev) => ({
            ...prev,
            imageFile: null,
            imagePreview: null,
        }));

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const payload = {
                name: form.name,
            };

            if (editingCat) {
                await updateCategory(editingCat.id, payload, form.imageFile);
            } else {
                await createCategory(payload, form.imageFile);
            }

            closeModal();
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm("Delete this category?");
        if (!confirmed) return;

        setDeletingId(id);
        await deleteCategory(id);
        setDeletingId(null);
    };

    return (
        <div className="cp-root">
            <div className="cp-header">
                <div className="cp-header-left">
                    <div className="cp-header-icon">
                        <Layers size={18} strokeWidth={1.8} />
                    </div>

                    <div>
                        <h1 className="cp-title">Categories</h1>
                        <p className="cp-subtitle">
                            Manage store's product categories
                        </p>
                    </div>
                </div>

                <button className="cp-btn-add" onClick={openAdd}>
                    <Plus size={15} strokeWidth={2.2} />
                    <span>Add Category</span>
                </button>
            </div>

            {error && (
                <div className="cp-error">
                    <X size={14} />
                    {error}
                </div>
            )}

            <div className="cp-stats">
                <div className="cp-stat">
                    <span className="cp-stat-value">
                        {categories.length}
                    </span>
                    <span className="cp-stat-label">Categories</span>
                </div>

                <div className="cp-stat-divider" />

                <div className="cp-stat">
                    <span className="cp-stat-value cp-stat-value--accent">
                        {stats.totalProducts}
                    </span>
                    <span className="cp-stat-label">Total products</span>
                </div>

                <div className="cp-stat-divider" />

                <div className="cp-stat">
                    <span
                        className={`cp-stat-value ${stats.emptyCategories > 0
                            ? "cp-stat-value--warn"
                            : "cp-stat-value--ok"
                            }`}
                    >
                        {stats.emptyCategories}
                    </span>
                    <span className="cp-stat-label">Empty categories</span>
                </div>

                <div className="cp-stat-divider" />

                <div className="cp-stat">
                    <span className="cp-stat-value">
                        {activeCategories}
                    </span>
                    <span className="cp-stat-label">Active categories</span>
                </div>
            </div>

            <div className="cp-toolbar">
                <div className="cp-search">
                    <Search size={14} className="cp-search-icon" strokeWidth={2} />

                    <input
                        className="cp-search-input"
                        type="text"
                        placeholder="Search categories…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    {search && (
                        <button
                            className="cp-search-clear"
                            onClick={() => setSearch("")}
                        >
                            <X size={13} />
                        </button>
                    )}
                </div>

                <span className="cp-result-count">
                    {filteredCategories.length}{" "}
                    {filteredCategories.length === 1 ? "result" : "results"}
                </span>
            </div>

            <div className="cp-body">
                {loading ? (
                    <div className="cp-state">
                        <div className="cp-spinner" />
                        <span>Loading categories…</span>
                    </div>
                ) : filteredCategories.length === 0 ? (
                    <div className="cp-state">
                        <div className="cp-empty-icon">
                            <Tag size={28} strokeWidth={1.4} />
                        </div>

                        <span className="cp-empty-title">
                            No categories found
                        </span>

                        <span className="cp-empty-sub">
                            {search
                                ? "Try a different search term"
                                : "Add your first category to get started"}
                        </span>

                        {!search && (
                            <button
                                className="cp-btn-add cp-btn-add--ghost"
                                onClick={openAdd}
                            >
                                <Plus size={14} />
                                Add Category
                            </button>
                        )}
                    </div>
                ) : (
                    <CategoriesTable
                        categories={filteredCategories}
                        deletingId={deletingId}
                        getCount={getCount}
                        onEdit={openEdit}
                        onDelete={handleDelete}
                    />
                )}
            </div>

            {showModal && (
                <CategoryModal
                    editingCat={editingCat}
                    form={form}
                    submitting={submitting}
                    fileInputRef={fileInputRef}
                    onClose={closeModal}
                    onSubmit={handleSubmit}
                    onNameChange={updateFormName}
                    onImageChange={updateImage}
                    onRemoveImage={removeImage}
                />
            )}
        </div>
    );
};

export default CategoriesPage;