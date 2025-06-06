import styles from "../../css/AdvisoryManager.module.css";
import Subcategory from "./Subcategory";

function Category({
    category,
    selectedKey,
    setSelectedKey,
    subcategories,
    subSelectedKey,
    setSubSelectedKey,
    advisoryText,
    onAdvisoryUpdate,
    onAdvisoryDelete,
}) {
    const isSelected = selectedKey === category.id;

    return (
        <div>
            <div
                className={styles.advisoryManagerCategoryPlatform}
                onClick={() => setSelectedKey(category.id)}
            >
                {category.name}
            </div>
            {isSelected && (
                <div className={styles.advisoryManagerSubcategoryPlatform}>
                    {subcategories.map((subcategory) => (
                        <Subcategory
                            key={subcategory.id}
                            subcategory={subcategory}
                            subSelectedKey={subSelectedKey}
                            setSubSelectedKey={setSubSelectedKey}
                            advisoryText={advisoryText}
                            onAdvisoryUpdate={onAdvisoryUpdate}
                            onAdvisoryDelete={onAdvisoryDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Category;
