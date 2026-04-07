import { useState, useRef } from "react";
import { useCategoryContext } from "../../../Context/Category";
import { useProductContext } from "../../../context/Product";
import { Search, Plus, ImageIcon, X, Tag, Pencil, Trash2, Layers, Package } from "lucide-react";
import "./index.css";

const CategoriesPage = () => {
    const { categories, loading, error, createCategory, updateCategory, deleteCategory } = useCategoryContext();
    const { products = [] } = useProductContext();

    const getCount = (cat) =>
        products.filter(p =>
            (p.category?.id != null && p.category.id === cat.id) ||
            (p.category_id != null && p.category_id === cat.id)
        ).length;

    const totalProducts = products.length;
    const emptyCategories = categories.filter(c => getCount(c) === 0).length;

    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingCat, setEditingCat] = useState(null);
    const [form, setForm] = useState({ name: "" });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const fileInputRef = useRef(null);

    const filtered = categories.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    const resetForm = () => {
        setForm({ name: "" });
        setImageFile(null);
        setImagePreview(null);
        setEditingCat(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const openAdd = () => { resetForm(); setShowModal(true); };
    const openEdit = (cat) => {
        setForm({ name: cat.name });
        setImageFile(null);
        setImagePreview(cat.image_url ?? null);
        setEditingCat(cat);
        setShowModal(true);
    };
    const closeModal = () => { setShowModal(false); resetForm(); };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingCat) await updateCategory(editingCat.id, form, imageFile);
            else await createCategory(form, imageFile);
            closeModal();
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this category?")) {
            setDeletingId(id);
            await deleteCategory(id);
            setDeletingId(null);
        }
    };

    return (
        <div className="cp-root">

            {/* Header */}
            <div className="cp-header">
                <div className="cp-header-left">
                    <div className="cp-header-icon">
                        <Layers size={18} strokeWidth={1.8} />
                    </div>
                    <div>
                        <h1 className="cp-title">Categories</h1>
                        <p className="cp-subtitle">Manage store's product categories</p>
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

            {/* Stats bar */}
            <div className="cp-stats">
                <div className="cp-stat">
                    <span className="cp-stat-value">{categories.length}</span>
                    <span className="cp-stat-label">Categories</span>
                </div>
                <div className="cp-stat-divider" />
                <div className="cp-stat">
                    <span className="cp-stat-value cp-stat-value--accent">{totalProducts}</span>
                    <span className="cp-stat-label">Total products</span>
                </div>
                <div className="cp-stat-divider" />
                <div className="cp-stat">
                    <span className={`cp-stat-value ${emptyCategories > 0 ? "cp-stat-value--warn" : "cp-stat-value--ok"}`}>
                        {emptyCategories}
                    </span>
                    <span className="cp-stat-label">Empty categories</span>
                </div>
                <div className="cp-stat-divider" />
                <div className="cp-stat">
                    <span className="cp-stat-value">
                        {categories.length - emptyCategories}
                    </span>
                    <span className="cp-stat-label">Active categories</span>
                </div>
            </div>

            {/* Toolbar */}
            <div className="cp-toolbar">
                <div className="cp-search">
                    <Search size={14} className="cp-search-icon" strokeWidth={2} />
                    <input
                        className="cp-search-input"
                        type="text"
                        placeholder="Search categories…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    {search && (
                        <button className="cp-search-clear" onClick={() => setSearch("")}>
                            <X size={13} />
                        </button>
                    )}
                </div>
                <span className="cp-result-count">
                    {filtered.length} {filtered.length === 1 ? "result" : "results"}
                </span>
            </div>

            {/* Table */}
            <div className="cp-body">
                {loading ? (
                    <div className="cp-state">
                        <div className="cp-spinner" />
                        <span>Loading categories…</span>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="cp-state">
                        <div className="cp-empty-icon">
                            <Tag size={28} strokeWidth={1.4} />
                        </div>
                        <span className="cp-empty-title">No categories found</span>
                        <span className="cp-empty-sub">
                            {search ? "Try a different search term" : "Add your first category to get started"}
                        </span>
                        {!search && (
                            <button className="cp-btn-add cp-btn-add--ghost" onClick={openAdd}>
                                <Plus size={14} /> Add Category
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="cp-table-wrap">
                        <table className="cp-table">
                            <thead>
                                <tr>
                                    <th className="cp-th cp-th--id">ID</th>
                                    <th className="cp-th cp-th--img">Image</th>
                                    <th className="cp-th cp-th--name">Name</th>
                                    <th className="cp-th cp-th--products">Products</th>
                                    <th className="cp-th cp-th--actions">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((cat, i) => {
                                    const count = getCount(cat);
                                    const isEmpty = count === 0;
                                    return (
                                        <tr
                                            key={cat.id}
                                            className={`cp-row ${deletingId === cat.id ? "cp-row--deleting" : ""} ${isEmpty ? "cp-row--empty" : ""}`}
                                            style={{ "--row-i": i }}
                                        >
                                            <td className="cp-td">
                                                <span className="cp-id">#{cat.id}</span>
                                            </td>
                                            <td className="cp-td">
                                                {cat.image_url ? (
                                                    <div className="cp-img-wrap">
                                                        <img src={cat.image_url} alt={cat.name} className="cp-img" />
                                                    </div>
                                                ) : (
                                                    <div className="cp-img-placeholder">
                                                        <ImageIcon size={16} strokeWidth={1.6} />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="cp-td">
                                                <div className="cp-name-cell">
                                                    <span className="cp-name">{cat.name}</span>
                                                    {isEmpty && (
                                                        <span className="cp-badge cp-badge--empty">Empty</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="cp-td">
                                                <div className="cp-product-count">
                                                    <Package size={13} strokeWidth={2} className={`cp-product-icon ${isEmpty ? "cp-product-icon--empty" : ""}`} />
                                                    <span className={`cp-product-num ${isEmpty ? "cp-product-num--empty" : ""}`}>{count}</span>
                                                    <span className="cp-product-label">
                                                        {count === 1 ? "product" : "products"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="cp-td">
                                                <div className="cp-actions">
                                                    <button
                                                        className="cp-action-btn cp-action-btn--edit"
                                                        onClick={() => openEdit(cat)}
                                                        title="Edit"
                                                    >
                                                        <Pencil size={13} strokeWidth={2} />
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="cp-action-btn cp-action-btn--del"
                                                        onClick={() => handleDelete(cat.id)}
                                                        disabled={deletingId === cat.id}
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={13} strokeWidth={2} />
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="cp-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
                    <div className="cp-modal">
                        <div className="cp-modal-header">
                            <div className="cp-modal-title-wrap">
                                <div className="cp-modal-icon">
                                    {editingCat ? <Pencil size={14} /> : <Plus size={14} />}
                                </div>
                                <span className="cp-modal-title">
                                    {editingCat ? "Edit Category" : "New Category"}
                                </span>
                            </div>
                            <button className="cp-modal-close" onClick={closeModal}>
                                <X size={16} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="cp-modal-form">
                            <div className="cp-field">
                                <label className="cp-label">Category name <span className="cp-required">*</span></label>
                                <input
                                    className="cp-input"
                                    type="text"
                                    placeholder="e.g. Indoor Plants"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    autoFocus
                                    required
                                />
                            </div>

                            <div className="cp-field">
                                <label className="cp-label">Image <span className="cp-label-hint">(optional)</span></label>
                                {imagePreview ? (
                                    <div className="cp-preview-wrap">
                                        <img src={imagePreview} alt="preview" className="cp-preview" />
                                        <div className="cp-preview-actions">
                                            <button type="button" className="cp-preview-change" onClick={() => fileInputRef.current?.click()}>
                                                Change image
                                            </button>
                                            <button type="button" className="cp-preview-remove" onClick={() => {
                                                setImageFile(null);
                                                setImagePreview(null);
                                                if (fileInputRef.current) fileInputRef.current.value = "";
                                            }}>
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="cp-upload" onClick={() => fileInputRef.current?.click()}>
                                        <div className="cp-upload-icon"><ImageIcon size={20} strokeWidth={1.4} /></div>
                                        <span className="cp-upload-text">Click to upload</span>
                                    </div>
                                )}
                                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} style={{ display: "none" }} />
                            </div>

                            <div className="cp-modal-footer">
                                <button type="button" className="cp-btn-cancel" onClick={closeModal}>Cancel</button>
                                <button type="submit" className="cp-btn-save" disabled={submitting}>
                                    {submitting ? (<><span className="cp-btn-spinner" />Saving…</>) : editingCat ? "Save changes" : "Create category"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoriesPage;