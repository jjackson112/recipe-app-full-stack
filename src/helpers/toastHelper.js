import { toast } from "react-toastify";

/* give the type parameter a default value in case someone forgets to add the second argument */

const displayToast = (message, type="success") => {
    const options = {
        position: "bottom-right",
        autoClose: "2000"
    }

    if (type="success") {
        return toast.success(message, options)
    } else if (type="error") {
        return toast.error(message, options)
    }
}