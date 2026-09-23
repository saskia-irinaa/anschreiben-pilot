import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  IconButton,
  Input,
  List,
  ListItem,
  useColorModeValue,
} from '@chakra-ui/react';
import { MdArrowUpward, MdArrowDownward, MdDelete, MdPictureAsPdf } from 'react-icons/md';
import { useRef, useState, DragEvent, ChangeEvent } from 'react';
import { PDFDocument } from 'pdf-lib';
import BorderBox from './components/BorderBox';

interface MappeFile {
  id: string;
  file: File;
}

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function BewerbungsmappePage() {
  const [files, setFiles] = useState<MappeFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isMerging, setIsMerging] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragBg = useColorModeValue('bg-contrast-sm', 'bg-contrast-sm');

  function addFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;

    const pdfFiles: MappeFile[] = [];
    const rejected: string[] = [];

    Array.from(fileList).forEach((file) => {
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        pdfFiles.push({ id: makeId(), file });
      } else {
        rejected.push(file.name);
      }
    });

    if (rejected.length > 0) {
      setErrorText(`Nur PDF-Dateien werden unterstützt: ${rejected.join(', ')}`);
    } else {
      setErrorText(null);
    }

    setFiles((prev) => [...prev, ...pdfFiles]);
  }

  function handleFileInputChange(event: ChangeEvent<HTMLInputElement>) {
    addFiles(event.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    addFiles(event.dataTransfer.files);
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
  }

  function handleFileButtonClick() {
    fileInputRef.current?.click();
  }

  function moveFile(index: number, direction: -1 | 1) {
    setFiles((prev) => {
      const next = [...prev];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= next.length) return prev;
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  }

  function removeFile(id: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }

  async function mergeAndDownload() {
    if (files.length < 2) {
      setErrorText('Bitte lade mindestens zwei PDFs hoch (z. B. Lebenslauf und Anschreiben).');
      return;
    }

    setIsMerging(true);
    setErrorText(null);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const { file } of files) {
        const arrayBuffer = await file.arrayBuffer();
        const sourcePdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'Bewerbungsmappe.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      setErrorText(
        'Beim Zusammenführen ist ein Fehler aufgetreten. Bitte stelle sicher, dass alle Dateien gültige, nicht passwortgeschützte PDFs sind.'
      );
    } finally {
      setIsMerging(false);
    }
  }

  return (
    <BorderBox>
      <Heading size='md' alignSelf='start' mb={1} w='full'>
        Bewerbungsmappe erstellen
      </Heading>
      <Text fontSize='sm' color='text-contrast-md' alignSelf='start'>
        Füge Lebenslauf, Anschreiben und optional Zeugnisse als PDFs hinzu, bringe sie in die
        richtige Reihenfolge und lade deine fertige Bewerbungsmappe als ein einziges PDF herunter.
        Alles läuft direkt in deinem Browser – deine Dateien werden nicht hochgeladen.
      </Text>

      <Input
        id='mappe-files'
        type='file'
        accept='application/pdf'
        multiple
        display='none'
        ref={fileInputRef}
        onChange={handleFileInputChange}
      />

      <VStack
        w='full'
        border={isDragging ? '2px dashed' : 'sm'}
        borderColor={isDragging ? 'purple.300' : undefined}
        bg={isDragging ? dragBg : 'bg-contrast-xs'}
        borderRadius='md'
        p={5}
        transition='all 0.2s ease-in-out'
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <MdPictureAsPdf size={28} />
        <Text fontSize='sm' textAlign='center'>
          PDFs hierher ziehen oder auswählen
        </Text>
        <Button size='sm' colorScheme='contrast' onClick={handleFileButtonClick}>
          PDFs auswählen
        </Button>
      </VStack>

      {errorText && (
        <Text fontSize='sm' color='red.400' alignSelf='start'>
          {errorText}
        </Text>
      )}

      {files.length > 0 && (
        <List w='full' spacing={2}>
          {files.map((mappeFile, index) => (
            <ListItem key={mappeFile.id}>
              <HStack
                bg='bg-contrast-xs'
                borderRadius='md'
                px={3}
                py={2}
                justify='space-between'
                _hover={{ bg: 'bg-contrast-sm' }}
              >
                <HStack overflow='hidden'>
                  <Text fontSize='sm' fontWeight='semibold' color='text-contrast-md'>
                    {index + 1}.
                  </Text>
                  <Text fontSize='sm' noOfLines={1}>
                    {mappeFile.file.name}
                  </Text>
                </HStack>
                <HStack>
                  <IconButton
                    aria-label='Nach oben verschieben'
                    icon={<MdArrowUpward />}
                    size='xs'
                    variant='ghost'
                    isDisabled={index === 0}
                    onClick={() => moveFile(index, -1)}
                  />
                  <IconButton
                    aria-label='Nach unten verschieben'
                    icon={<MdArrowDownward />}
                    size='xs'
                    variant='ghost'
                    isDisabled={index === files.length - 1}
                    onClick={() => moveFile(index, 1)}
                  />
                  <IconButton
                    aria-label='Entfernen'
                    icon={<MdDelete />}
                    size='xs'
                    variant='ghost'
                    colorScheme='red'
                    onClick={() => removeFile(mappeFile.id)}
                  />
                </HStack>
              </HStack>
            </ListItem>
          ))}
        </List>
      )}

      <Button
        colorScheme='purple'
        mt={3}
        size='sm'
        alignSelf='start'
        isLoading={isMerging}
        loadingText='Wird zusammengeführt...'
        isDisabled={files.length < 2}
        onClick={mergeAndDownload}
      >
        Bewerbungsmappe herunterladen
      </Button>

      <Box alignSelf='start'>
        <Text fontSize='xs' color='text-contrast-md'>
          Kostenlos und ohne Anmeldung. Empfohlene Reihenfolge: Deckblatt (optional), Anschreiben,
          Lebenslauf, Zeugnisse.
        </Text>
      </Box>
    </BorderBox>
  );
}

export default BewerbungsmappePage;
