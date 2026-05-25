import { ImageIcon, Pencil, Trash2, Package } from "lucide-react";

const CategoriesTable = ({
    categories,
    deletingId,
    getCount,
    onEdit,
    onDelete,
}) => {
    return (
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
                    {categories.map((category, index) => {
                        const count = getCount(category);
                        const isEmpty = count === 0;

                        return (
                            <tr
                                key={category.id}
                                className={`cp-row ${deletingId === category.id
                                    ? "cp-row--deleting"
                                    : ""
                                    } ${isEmpty ? "cp-row--empty" : ""}`}
                                style={{ "--row-i": index }}
                            >
                                <td className="cp-td">
                                    <span className="cp-id">
                                        #{category.id}
                                    </span>
                                </td>

                                <td className="cp-td">
                                    {category.image_url ? (
                                        <div className="cp-img-wrap">
                                            <img
                                                src={category.image_url}
                                                alt={category.name}
                                                className="cp-img"
                                            />
                                        </div>
                                    ) : (
                                        <div className="cp-img-placeholder">
                                            <ImageIcon size={16} strokeWidth={1.6} />
                                        </div>
                                    )}
                                </td>

                                <td className="cp-td">
                                    <div className="cp-name-cell">
                                        <span className="cp-name">
                                            {category.name}
                                        </span>

                                        {isEmpty && (
                                            <span className="cp-badge cp-badge--empty">
                                                Empty
                                            </span>
                                        )}
                                    </div>
                                </td>

                                <td className="cp-td">
                                    <div className="cp-product-count">
                                        <Package
                                            size={13}
                                            strokeWidth={2}
                                            className={`cp-product-icon ${isEmpty
                                                ? "cp-product-icon--empty"
                                                : ""
                                                }`}
                                        />

                                        <span
                                            className={`cp-product-num ${isEmpty
                                                ? "cp-product-num--empty"
                                                : ""
                                                }`}
                                        >
                                            {count}
                                        </span>

                                        <span className="cp-product-label">
                                            {count === 1
                                                ? "product"
                                                : "products"}
                                        </span>
                                    </div>
                                </td>

                                <td className="cp-td">
                                    <div className="cp-actions">
                                        <button
                                            className="cp-action-btn cp-action-btn--edit"
                                            onClick={() => onEdit(category)}
                                            title="Edit"
                                        >
                                            <Pencil size={13} strokeWidth={2} />
                                            Edit
                                        </button>

                                        <button
                                            className="cp-action-btn cp-action-btn--del"
                                            onClick={() => onDelete(category.id)}
                                            disabled={deletingId === category.id}
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
    );
};

export default CategoriesTable;