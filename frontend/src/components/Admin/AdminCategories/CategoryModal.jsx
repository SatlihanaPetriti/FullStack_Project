import { Plus, Pencil, X, ImageIcon } from "lucide-react";

const CategoryModal = ({
    editingCat,
    form,
    submitting,
    fileInputRef,
    onClose,
    onSubmit,
    onNameChange,
    onImageChange,
    onRemoveImage,
}) => {
    const isEditMode = Boolean(editingCat);

    const openFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        onImageChange(file);
    };

    const closeOnOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="cp-overlay" onClick={closeOnOverlayClick}>
            <div className="cp-modal">
                <div className="cp-modal-header">
                    <div className="cp-modal-title-wrap">
                        <div className="cp-modal-icon">
                            {isEditMode ? (
                                <Pencil size={14} />
                            ) : (
                                <Plus size={14} />
                            )}
                        </div>

                        <span className="cp-modal-title">
                            {isEditMode ? "Edit Category" : "New Category"}
                        </span>
                    </div>

                    <button className="cp-modal-close" onClick={onClose}>
                        <X size={16} />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="cp-modal-form">
                    <div className="cp-field">
                        <label className="cp-label">
                            Category name{" "}
                            <span className="cp-required">*</span>
                        </label>

                        <input
                            className="cp-input"
                            type="text"
                            placeholder="e.g. Indoor Plants"
                            value={form.name}
                            onChange={(e) => onNameChange(e.target.value)}
                            autoFocus
                            required
                        />
                    </div>

                    <div className="cp-field">
                        <label className="cp-label">
                            Image{" "}
                            <span className="cp-label-hint">
                                (optional)
                            </span>
                        </label>

                        {form.imagePreview ? (
                            <div className="cp-preview-wrap">
                                <img
                                    src={form.imagePreview}
                                    alt="preview"
                                    className="cp-preview"
                                />

                                <div className="cp-preview-actions">
                                    <button
                                        type="button"
                                        className="cp-preview-change"
                                        onClick={openFileInput}
                                    >
                                        Change image
                                    </button>

                                    <button
                                        type="button"
                                        className="cp-preview-remove"
                                        onClick={onRemoveImage}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="cp-upload" onClick={openFileInput}>
                                <div className="cp-upload-icon">
                                    <ImageIcon size={20} strokeWidth={1.4} />
                                </div>

                                <span className="cp-upload-text">
                                    Click to upload
                                </span>
                            </div>
                        )}

                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            style={{ display: "none" }}
                        />
                    </div>

                    <div className="cp-modal-footer">
                        <button
                            type="button"
                            className="cp-btn-cancel"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="cp-btn-save"
                            disabled={submitting}
                        >
                            {submitting ? (
                                <>
                                    <span className="cp-btn-spinner" />
                                    Saving…
                                </>
                            ) : isEditMode ? (
                                "Save changes"
                            ) : (
                                "Create category"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryModal;