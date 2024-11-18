import { Supplier } from "../models/classes/supplier";
import { AcmeSupplier } from "../suppliers/acme";
import { PaperfliesSupplier } from "../suppliers/paperflies";
import { PatagoniaSupplier } from "../suppliers/patagonia";

// List of suppliers for fetching hotel data
export const DATA_SUPPLIERS: Supplier[] = [
    new AcmeSupplier(),
    new PatagoniaSupplier(),
    new PaperfliesSupplier(),
    // new suppliers can be added if needed
];
