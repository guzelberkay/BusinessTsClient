import React, { useState } from 'react';
import { Button, Input, Typography } from '@mui/material';

interface IFileUpload {
  onFileUpload: (files: File[]) => void;  
  accept?: string;                        
  buttonText?: string;     
  disabled?: boolean;                
}

function FileUploadProps(props: IFileUpload) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setSelectedFiles(filesArray);
    }
  };

  const handleUploadClick = () => {
    if (selectedFiles.length > 0) {
      props.onFileUpload(selectedFiles);
      const file = selectedFiles[0]; // İlk dosyayı al
      if (file.type === 'application/pdf') {
        // PDF dosyası yüklendiyse, indirme URL'sini oluştur
        const blobUrl = URL.createObjectURL(file);
        setDownloadUrl(blobUrl); // PDF için indirme URL'sini ayarla
      }
      setSelectedFiles([]); // Yükleme sonrası seçilen dosyaları sıfırla
    }
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Dosya Yükleme
      </Typography>
      <Input
        type="file"
        onChange={handleFileChange}
        inputProps={{ accept: props.accept }} 
        disabled={props.disabled}
      />
      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: '10px', marginLeft: '10px' }}
        onClick={handleUploadClick}
        disabled={selectedFiles.length === 0 || props.disabled}  
      >
        {props.buttonText}
      </Button>

      {/* PDF indirme butonu */}
      {downloadUrl && (
        <div style={{ marginTop: '20px' }}>
          <Typography variant="h6">PDF İndirme:</Typography>
          <Button variant="contained" color="primary" href={downloadUrl} download>
            PDF İndir
          </Button>
        </div>
      )}
    </div>
  );
}

export default FileUploadProps;

