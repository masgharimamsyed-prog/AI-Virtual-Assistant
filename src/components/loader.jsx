import { Oval } from "react-loader-spinner";

function Loader() {
    return (
        <Oval
            height={50}
            width={50}
            color="black"
            visible={true}
        />
    );
}

export default Loader;