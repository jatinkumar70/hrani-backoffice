import { Box } from '@mui/material';
import DropZone from 'components/DropZone';
import { IFileUpload } from 'components/FileUpload/FileUpload.type';
import { uploadMultipleFileV2 } from 'components/FileUpload/utils';
import { FlexBox } from 'components/flex-box';
import { getUniqueId } from 'helpers/getUniqueId';
import { StyledClear, UploadImageBox } from 'pages-sections/vendor-dashboard/styles';
import React from 'react';

interface Props {
    value: IFileUpload[];
    onMultiChange: (data: IFileUpload[]) => void;
    title?: string;
}

export function CustomImageUpload({ value, onMultiChange, title = "" }: Props) {
    const [images, setImages] = React.useState<IFileUpload[]>(value)

    React.useEffect(() => {
        setImages(value)
    }, [value])

    // HANDLE UPDATE NEW IMAGE VIA DROP ZONE
    const handleChangeDropZone = (data: File[]) => {
        console.log("handleChangeDropZone==>", data)
        const newImages = data.map((file) => ({
            key: getUniqueId(),
            file,
            name: file.name,
            path: URL.createObjectURL(file),
        }));
        const updatedImages = [...images, ...newImages];
        setImages(updatedImages);
        onMultiChange(updatedImages)
    };

    // HANDLE DELETE UPLOAD IMAGE
    const handleFileDelete = (image: IFileUpload) => () => {
        console.log("handleFileDelete==>", image)
        onMultiChange(images.filter((item) => item?.key !== image.key));
        setImages((img) => img.filter((item) => item?.key !== image.key));
    };


    console.log("CustomImageUpload ==>", images)
    return (
        <>
            <DropZone
                title={title}
                imageSize="Recommended size 600*500px"
                onChange={(files) => handleChangeDropZone(files)}
            />

            <FlexBox flexDirection="row" mt={2} flexWrap="wrap" gap={1}>
                {images.map((item, index) => {
                    return (
                        <UploadImageBox key={index}>
                            <Box component="img" alt="product" src={item?.path} width="100%" />
                            <StyledClear onClick={handleFileDelete(item)} />
                        </UploadImageBox>
                    );
                })}
            </FlexBox>
        </>
    );
};











interface SingleImageUpload2Props {
    file: string;
    onFileChange: (path: string | null) => void;
    title?: string;
    asPayload: {
        [key: string]: string | number | null;
    }
}

export function SingleImageUploadV2({
    file,
    onFileChange,
    title = "",
    asPayload
}: SingleImageUpload2Props) {

    // HANDLE UPDATE NEW IMAGE VIA DROP ZONE
    const handleChangeDropZone = async (data: File[]) => {
        const newfile = data[0];
        const newPaths = await uploadMultipleFileV2(
            [newfile],
            "PROPERTY",
            asPayload
        );
        onFileChange(newPaths[0])

    };

    // HANDLE DELETE UPLOAD IMAGE
    const handleFileDelete = () => {
        onFileChange(null);
    };
    return (
        <>
            {file ?
                (
                    <FlexBox flexDirection="row" mt={2} gap={1}>
                        <UploadImageBox>
                            <Box component="img" alt="product" src={file} width="100%" />
                            <StyledClear onClick={handleFileDelete} />
                        </UploadImageBox>
                    </FlexBox>
                )
                :
                (
                    <DropZone
                        title={title}
                        imageSize="Recommended size 600*500px"
                        onChange={(files) => handleChangeDropZone(files)}
                    />
                )
            }
        </>
    )
}


interface SingleImageUploadProps {
    value: string;
    onImageChange: (data: IFileUpload | null) => void;
    title?: string;
    handlePropertyPicImageChange: (file: File) => void;
    setFieldValue: (field: string, value: any) => void
}

export function SingleImageUpload({
    value,
    onImageChange,
    handlePropertyPicImageChange,
    title = "",
    setFieldValue
}: SingleImageUploadProps) {
    console.log(value)
    const [image, setImage] = React.useState<string>("");
    console.log(image)

    React.useEffect(() => {
        if (!image && value) {
            setImage(value)
        }
    }, [])

    // HANDLE UPDATE NEW IMAGE VIA DROP ZONE
    const handleChangeDropZone = (data: File[]) => {
        const file = data[0];
        handlePropertyPicImageChange(file)
        setImage(URL.createObjectURL(file));
    };

    // HANDLE DELETE UPLOAD IMAGE
    const handleFileDelete = () => {
        setImage(null);
        setFieldValue("property_details_profile_pic", null);
    };
    return (
        <>
            {image ?
                (
                    <FlexBox flexDirection="row" mt={2} gap={1}>
                        <UploadImageBox>
                            <Box component="img" alt="product" src={image} width="100%" />
                            <StyledClear onClick={handleFileDelete} />
                        </UploadImageBox>
                    </FlexBox>
                )
                :
                (
                    <DropZone
                        title={title}
                        imageSize="Recommended size 600*500px"
                        onChange={(files) => handleChangeDropZone(files)}
                    />
                )
            }
        </>
    )
}