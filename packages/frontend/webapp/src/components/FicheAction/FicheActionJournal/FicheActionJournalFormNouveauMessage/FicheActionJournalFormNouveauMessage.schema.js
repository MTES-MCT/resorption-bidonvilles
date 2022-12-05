import { object, string } from "yup";
import labels from "./FicheActionJournalFormNouveauMessage.labels";

export default object({
    comment: string().required().label(labels.comment),
});
