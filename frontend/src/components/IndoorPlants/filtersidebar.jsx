import { useCategoryContext } from '../../Context/Category';
import './filtersidebar.css';

const PRICE_RANGES = [
    { label: '$50 – $100', key: '50-100' },
    { label: '$100 – $150', key: '100-150' },
    { label: '$150 – $200', key: '150-200' },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const FilterSidebar = ({ filters, onChange }) => {
    const { categories } = useCategoryContext();

    const toggle = (key, value) => {
        const current = filters[key] || [];
        const next = current.includes(value)
            ? current.filter(v => v !== value)
            : [...current, value];
        onChange({ ...filters, [key]: next });
    };

    const toggleBool = (key) => {
        onChange({ ...filters, [key]: !filters[key] });
    };

    const clearAll = () => {
        onChange({ categories: [], priceRanges: [], sizes: [], onSalePercent: false });
    };

    const hasActive =
        filters.categories?.length > 0 ||
        filters.priceRanges?.length > 0 ||
        filters.sizes?.length > 0 ||
        filters.onSalePercent;

    const activeCount =
        (filters.categories?.length || 0) +
        (filters.priceRanges?.length || 0) +
        (filters.sizes?.length || 0) +
        (filters.onSalePercent ? 1 : 0);

    return (
        <div className="fsb">

            {/* HEADER */}
            <div className="fsb-top">
                <span className="fsb-heading">Filters</span>
            </div>

            {/* CATEGORY */}
            <details className="fsb-group" open>
                <summary className="fsb-group-header">
                    <span>Category</span>
                    <svg className="fsb-chevron" viewBox="0 0 16 16" fill="none">
                        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </summary>
                <div className="fsb-options">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            className={`fsb-pill ${filters.categories?.includes(cat.id) ? 'fsb-pill--active' : ''}`}
                            onClick={() => toggle('categories', cat.id)}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </details>

            {/* PRICE */}
            <details className="fsb-group" open>
                <summary className="fsb-group-header">
                    <span>Price</span>
                    <svg className="fsb-chevron" viewBox="0 0 16 16" fill="none">
                        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </summary>
                <div className="fsb-options">
                    {PRICE_RANGES.map(({ label, key }) => (
                        <button
                            key={key}
                            className={`fsb-pill ${filters.priceRanges?.includes(key) ? 'fsb-pill--active' : ''}`}
                            onClick={() => toggle('priceRanges', key)}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </details>

            {/* OFFERS */}
            <details className="fsb-group" open>
                <summary className="fsb-group-header">
                    <span>Offers</span>
                    <svg className="fsb-chevron" viewBox="0 0 16 16" fill="none">
                        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </summary>
                <div className="fsb-options">
                    <button
                        className={`fsb-pill fsb-pill--offer ${filters.onSalePercent ? 'fsb-pill--active' : ''}`}
                        onClick={() => toggleBool('onSalePercent')}
                    >
                        Sale %
                    </button>
                </div>
            </details>

            {/* SIZE */}
            <details className="fsb-group" open>
                <summary className="fsb-group-header">
                    <span>Size</span>
                    <svg className="fsb-chevron" viewBox="0 0 16 16" fill="none">
                        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </summary>
                <div className="fsb-sizes">
                    {SIZES.map(s => (
                        <button
                            key={s}
                            className={`fsb-size ${filters.sizes?.includes(s) ? 'fsb-size--active' : ''}`}
                            onClick={() => toggle('sizes', s)}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </details>

            {/* CLEAR */}
            <div className="fsb-bottom">
                {hasActive && (
                    <button className="fsb-clear-bottom" onClick={clearAll}>
                        Clear Filters ({activeCount})
                    </button>
                )}
            </div>

        </div>
    );
};

export default FilterSidebar;