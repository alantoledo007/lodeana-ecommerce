import { ENDPOINTS } from "@constants/endpoints";
import { useEffect, useRef, useState } from "react";

export default function Gallery() {
  const [base64, setBase64] = useState();
  let inputRef = useRef();

  const parseToBase64 = (e) => {
    const reader = new FileReader();
    reader.onload = _handleReaderLoaded;
    reader.readAsDataURL(e.target.files[0]);
  };

  const _handleReaderLoaded = (readerEvt) => {
    let binaryString = readerEvt.target.result;
    setBase64(binaryString);
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("image", inputRef.current.files[0]);
    fetch("/api/gallery", {
      method: "POST",
      body: formData,
    });
  };

  return (
    <div>
      <input
        name="image"
        onChange={parseToBase64}
        ref={inputRef}
        type="file"
        accept="image/*"
      />
      <img src={base64} width={200} />
      <button onClick={handleSubmit} disabled={!base64}>
        Subir foto
      </button>
    </div>
  );
}

export const AddImage = ({
  onUploadSuccess = () => {},
  onUploadError = () => {},
  onLoading = () => {},
}) => {
  const [base64, setBase64] = useState();
  const [isLoading, setIsLoading] = useState(false);
  let inputRef = useRef();

  const parseToBase64 = (e) => {
    const reader = new FileReader();
    reader.onload = _handleReaderLoaded;
    reader.readAsDataURL(e.target.files[0]);
  };

  const _handleReaderLoaded = (readerEvt) => {
    let binaryString = readerEvt.target.result;
    setBase64(binaryString);
  };

  const handleCancel = () => {
    inputRef.current.value = "";
    setBase64(undefined);
  };

  useEffect(() => {
    onLoading(isLoading);
  }, [isLoading, onLoading]);

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("image", inputRef.current.files[0]);
    setIsLoading(true);
    fetch(ENDPOINTS.gallery, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        inputRef.current.value = "";
        setBase64(undefined);
        onUploadSuccess(res.message);
      })
      .catch(onUploadError)
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div>
      <input
        name="image"
        onChange={parseToBase64}
        ref={inputRef}
        accept="image/*"
      />

      {base64 && (
        <>
          <div className="h-64 w-64 bg-white shadow-md rounded-sm flex justify-center items-center overflow-hidden mt-5">
            <img src={base64} width={200} />
          </div>
          <button
            type="button"
            className={`mt-5 w-full border-2 text-gray-500 border-gray-500 ${
              !isLoading &&
              "border-blue-500 text-blue-500 hover:bg-blue-700 hover:text-white"
            } py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "cargando..." : "Subir foto"}
          </button>
          {!isLoading && (
            <button
              type="button"
              className="w-full py-2 px-4 focus:outline-none focus:shadow-outline"
              onClick={handleCancel}
            >
              cancelar
            </button>
          )}
        </>
      )}
    </div>
  );
};
