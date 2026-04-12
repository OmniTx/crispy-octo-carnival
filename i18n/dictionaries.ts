export const dictionaries = {
  en: {
    products: "Products",
    addProduct: "Add Product",
    add: "Add",
    delete: "Delete",
    name: "Name",
    price: "Price",
    description: "Description",
    image: "Image",
    submit: "Submit",
    loading: "Loading...",
    error: "An error occurred.",
    success: "Success!",
    noProducts: "No products found.",
    brandName: "IBM Showcase",
    adminPanel: "Admin Panel",
    manageProducts: "Manage Products",
    optional: "Optional",
    actions: "Actions",
    noImage: "No Image"
  },
  bn: {
    products: "পণ্যসমূহ",
    addProduct: "পণ্য যোগ করুন",
    add: "যোগ করুন",
    delete: "মুছে ফেলুন",
    name: "নাম",
    price: "মূল্য",
    description: "বিবরণ",
    image: "ছবি",
    submit: "জমা দিন",
    loading: "লোড হচ্ছে...",
    error: "একটি ত্রুটি ঘটেছে৷",
    success: "সফল!",
    noProducts: "কোনও পণ্য পাওয়া যায়নি৷",
    brandName: "শোকেস",
    adminPanel: "অ্যাডমিন প্যানেল",
    manageProducts: "পণ্য পরিচালনা",
    optional: "ঐচ্ছিক",
    actions: "কার্যক্রম",
    noImage: "ছবি নেই"
  }
}

export type Locale = keyof typeof dictionaries;
export type Dictionary = typeof dictionaries.en;
