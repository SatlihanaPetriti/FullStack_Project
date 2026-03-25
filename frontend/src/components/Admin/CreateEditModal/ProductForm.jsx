import { useState, useEffect, useRef } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import ProductInfo from "./ProductInfo";
import VariantInput from "./VariantInput";
import VariantList from "./VariantList";


const IMAGE_BASE_URL = "http://localhost:3000/products/uploads";

// gjendja fillestare (per krijimin e produktiti te ri)
const EMPTY_FORM = {
    id: "",
    title: "",
    label: "",
    category: "Indoor",
    size: "SM",
    price: "",
    sale_price: "",
    sale_percentage: "",
    is_bundle: false,
    date_added: new Date().toISOString().split("T")[0],
    variants: [],
};

const EMPTY_VARIANT_INPUT = {
    id: "",
    type: "",
    stock: "",
    imageFile: null,
};
// konverton variiantin nga serveri ne formatin e formes
const toFormVariant = (v) => ({
    id: v.id || "",
    type: v.type || "",
    stock: v.stock || 0,
    imageName: v.image || "",
    imageFile: null,
    previewUrl: v.image ? `${IMAGE_BASE_URL}/${v.image}` : null,
});


// merren props nga prinderi
const ProductForm = ({ show, onClose, product, onSave, allProducts = [] }) => {
    // per te ruajtur te dhenat e plota
    const [formData, setFormData] = useState(EMPTY_FORM);
    // ruhen te dhenat e variantit para se te shtohen ne liste 
    const [variantInput, setVariantInput] = useState(EMPTY_VARIANT_INPUT);
    // shfaqja e imazhit
    const [variantPreview, setVariantPreview] = useState(null);
    //gaabimet e validimit
    const [errors, setErrors] = useState({ id: "", title: "" });
    // per te pastruar inputet e file pasi te shtohet nje variant 
    const fileInputRef = useRef(null);

    // funk pastrim i inputeve(pas shtimit te nje varianti inputet duhen t ejen bosh per te shtuar nje tjt)
    const resetVariantInput = () => {
        setVariantInput(EMPTY_VARIANT_INPUT);
        setVariantPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };
    // kontrollon nese eshte i perseritur
    const isUnique = (field, value) => {
        if (!value) return true;
        return !allProducts.some(p =>
            p[field].toLowerCase() === value.toLowerCase() && p.id !== product?.id
        );
    };

    // behet inicializimi i formes (ekzekutohet kur ndryshohet product ose show)
    useEffect(() => {
        if (product) {
            setFormData({
                id: product.id || "",
                title: product.title || "",
                label: product.label || "",
                category: product.category || "Indoor",
                size: product.size || "SM",
                price: product.price ?? "",
                sale_price: product.sale_price ?? "",
                sale_percentage: product.sale_percentage ?? "",
                is_bundle: product.is_bundle || false,
                date_added: product.date_added?.split("T")[0] || new Date().toISOString().split("T")[0],
                variants: product.variants?.map(toFormVariant) || [],
            });
        } else {
            setFormData(EMPTY_FORM);
        }
        resetVariantInput();
        setErrors({ id: "", title: "" });
    }, [product, show]);


    // validim ne kohe reale, ruan ate qe shkruhet dhe budle 
    const handleProductChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === "id") {
            setErrors(prev => ({
                ...prev,
                id: isUnique("id", value) ? "" : "A product with this ID already exists!"
            }));
        }
        if (name === "title") {
            setErrors(prev => ({
                ...prev,
                title: isUnique("title", value) ? "" : "A product with this title already exists!"
            }));
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    // perditesim i te dhenave te varianteve qe po shkruhet
    const handleVariantFieldChange = (e) => {
        const { name, value } = e.target;
        setVariantInput(prev => ({ ...prev, [name]: value }));
    };
    // merr imazhin e ruan ne varaintInput dhe nj  url per te pare imazhin
    const handleVariantImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setVariantInput(prev => ({ ...prev, imageFile: file }));
        setVariantPreview(URL.createObjectURL(file));
    };
    //shtohet varianti i ri ne listen e formData.variants
    const addVariant = () => {
        if (!variantInput.id || !variantInput.type) {
            alert("Variant ID and Type are required");
            return;
        }
        if (!variantInput.imageFile) {
            alert("Variant image is required");
            return;
        }
        if (formData.variants.some(v => v.id === variantInput.id)) {
            alert("Variant ID already exists in this product");
            return;
        }

        setFormData(prev => ({
            ...prev,
            variants: [...prev.variants, {
                id: variantInput.id,
                type: variantInput.type,
                stock: Number(variantInput.stock) || 0,
                imageName: null,
                imageFile: variantInput.imageFile,
                previewUrl: variantPreview,
            }]
        }));

        resetVariantInput();
    };
    // zevendesimi ii imazhit
    const replaceVariantImage = (index, e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFormData(prev => {
            const updated = [...prev.variants];
            updated[index] = {
                ...updated[index],
                imageFile: file,
                imageName: null, // fshihet imazhi i vjeter
                previewUrl: URL.createObjectURL(file),
            };
            return { ...prev, variants: updated };
        });
    };
    // fshirja e variantit me index nga lista
    const removeVariant = (index) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.filter((_, i) => i !== index)
        }));
    };

    // DERGOHET FORMA
    const handleSubmit = (e) => {
        e.preventDefault();

        const cleanedData = {
            ...formData,
            price: Number(formData.price),
            sale_price: formData.sale_price === "" ? null : Number(formData.sale_price),
            sale_percentage: formData.sale_percentage === "" ? null : Number(formData.sale_percentage),
            variants: formData.variants.map(v => ({
                id: v.id,
                type: v.type,
                stock: Number(v.stock),
                imageName: v.imageFile ? null : (v.imageName || null),
            })),
        };
        //ndaj imazhet
        const imageFiles = formData.variants.map(v => v.imageFile || null);
        //dergo te prindi
        onSave(cleanedData, imageFiles);
    };

    // kontrolli i butonit aktivizohet(ka te pakten nje variant, nuk ka gabime dhe nuk ka gabim ne titull)
    const canSubmit = formData.variants.length > 0 && !errors.id && !errors.title;

    return (
        <Modal show={show} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    {product ? "Edit Product" : "Add New Product"}
                </Modal.Title>
            </Modal.Header>

            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {/*te dhenat e produktit */}
                    <ProductInfo
                        formData={formData}
                        errors={errors}
                        onChange={handleProductChange}
                    />

                    <hr className="my-4" />

                    {/* input per variantin e ri*/}
                    <VariantInput
                        variantInput={variantInput}
                        previewUrl={variantPreview}
                        onFieldChange={handleVariantFieldChange}
                        onImageChange={handleVariantImageChange}
                        onAdd={addVariant}
                        fileInputRef={fileInputRef}
                    />

                    {/* lista e varianteve*/}
                    <VariantList
                        variants={formData.variants}
                        onReplaceImage={replaceVariantImage}
                        onRemove={removeVariant}
                    />
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                    <Button variant="primary" type="submit" disabled={!canSubmit}>
                        {product ? "Save Changes" : "Create Product"}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ProductForm;