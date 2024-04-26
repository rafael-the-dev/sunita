import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import Button from "@/components/shared/button";

const Container = ({ onClose }: { onClose: () => void }) => {

    return (
        <div className="flex flex-col grow items-center justify-center">
            <CheckCircleIcon className="text-green-700 text-9xl" />
            <Button
                className="mt-3 py-2 px-8"
                onClick={onClose}>
                New sale
            </Button>
        </div>
    );
};

export default Container;