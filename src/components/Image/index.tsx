import { useCallback, useState } from "react"
import Image from "next/image"
import classNames from "classnames"

type PropsType = {
    alt: string;
    className?: string;
    loader?: boolean;
    src: string;
}

const defaultImage = `/images/default-image.png`

const ImageContainer = ({ alt, className, loader, src }: PropsType) => {
    const [ imageSrc, setImageSrc ] = useState(src)

    const errorHandler = useCallback(
        () => setImageSrc(defaultImage),
        []
    )

    const imageLoader = () => src

    return (
        <div className={classNames(className, `relative`)}>
            <Image 
                alt={alt}
                className={classNames(`h-full object-cover w-full`)}
                fill
                loader={ loader ? imageLoader : null}
                onError={errorHandler}
                src={imageSrc}
            />
        </div>
    )
}

export default ImageContainer