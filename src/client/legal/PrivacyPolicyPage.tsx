import BorderBox from '../components/BorderBox';
import { useEffect } from 'react';
import LegalSection from './components/legalSection';
import {
  Heading,
  Text,
  VStack,
  UnorderedList,
  ListItem,
} from '@chakra-ui/react';

// TODO(Saskia): this is a real draft based on what the app actually does, not a
// translated version of the template's placeholder text anymore — that text named a
// different company's real name, home address and email (the original repo author's),
// which had to be removed outright, not translated. Still needs, before this goes live:
// 1. Fill in [PLATZHALTER] below with your real name/business name, address and email.
// 2. An actual lawyer's review — this is a solid-faith draft, not legal advice.
// 3. Re-check this page whenever a new third-party service or data flow is added.
const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <BorderBox>
      <VStack maxW='4xl' mx='auto' p={6} spacing={6} align='flex-start'>
        <Heading as='h1' size='xl' mb={6}>Datenschutzerklärung</Heading>
        <Text fontSize='sm' color='gray.600' mb={6}>Zuletzt aktualisiert: {new Date().toLocaleDateString('de-DE')}</Text>

        <LegalSection title='1. Verantwortlicher'>
          <Text>
            Verantwortlich für die Datenverarbeitung auf Anschreiben Pilot ist:
            <br />
            [PLATZHALTER: Vor- und Nachname bzw. Firmenname]
            <br />
            [PLATZHALTER: Adresse]
            <br />
            E-Mail: [PLATZHALTER: Kontakt-E-Mail-Adresse]
          </Text>
        </LegalSection>

        <LegalSection title='2. Welche Daten wir erheben'>
          <Text mb={4}>Wir erheben nur, was für den Betrieb des Dienstes nötig ist:</Text>
          <UnorderedList spacing={4}>
            <ListItem>
              <Text fontWeight='semibold'>Konto-Daten (bei Anmeldung mit Google):</Text>
              <UnorderedList ml={6} mt={2} spacing={2}>
                <ListItem>E-Mail-Adresse</ListItem>
                <ListItem>Von Google übermittelter Benutzername</ListItem>
              </UnorderedList>
            </ListItem>
            <ListItem>
              <Text fontWeight='semibold'>Inhaltsdaten:</Text>
              <UnorderedList ml={6} mt={2} spacing={2}>
                <ListItem>Von dir eingegebene Stellenanzeigen (Jobtitel, Unternehmen, Ort, Beschreibung)</ListItem>
                <ListItem>Der Text deines hochgeladenen Lebenslaufs — wird ausschließlich zur Erstellung des Anschreibens an OpenAI übermittelt und anschließend nicht dauerhaft gespeichert; gespeichert wird nur das erzeugte Anschreiben selbst</ListItem>
                <ListItem>PDFs, die du im kostenlosen Bewerbungsmappe-Tool zusammenfügst, werden zu keinem Zeitpunkt auf unseren Server hochgeladen — das Zusammenfügen geschieht vollständig in deinem Browser</ListItem>
              </UnorderedList>
            </ListItem>
            <ListItem>
              <Text fontWeight='semibold'>Zahlungsdaten:</Text>
              <UnorderedList ml={6} mt={2} spacing={2}>
                <ListItem>Abo-Status und Zahlungsverlauf (die eigentlichen Zahlungsdaten wie Kartennummern verarbeitet ausschließlich Stripe, wir sehen und speichern sie nicht)</ListItem>
              </UnorderedList>
            </ListItem>
          </UnorderedList>
        </LegalSection>

        <LegalSection title='3. Wie wir deine Daten nutzen'>
          <UnorderedList spacing={4}>
            <ListItem>
              <Text fontWeight='semibold'>Zur Bereitstellung des Dienstes:</Text>
              <UnorderedList ml={6} mt={2} spacing={2}>
                <ListItem>Erstellung deines individuellen Anschreibens</ListItem>
                <ListItem>Verwaltung deines Kontos</ListItem>
                <ListItem>Abwicklung deines Abos</ListItem>
              </UnorderedList>
            </ListItem>
            <ListItem>
              <Text fontWeight='semibold'>Zur Kommunikation:</Text>
              <UnorderedList ml={6} mt={2} spacing={2}>
                <ListItem>Hinweis vor Ablauf deines Abos</ListItem>
                <ListItem>Antwort auf deine Anfragen</ListItem>
              </UnorderedList>
            </ListItem>
          </UnorderedList>
        </LegalSection>

        <LegalSection title='4. Rechtsgrundlage der Verarbeitung (Art. 6 DSGVO)'>
          <UnorderedList spacing={4}>
            <ListItem>
              <Text fontWeight='semibold' as='span'>Vertragserfüllung (Art. 6 Abs. 1 lit. b): </Text>
              Verarbeitung, die zur Erbringung des Dienstes notwendig ist
            </ListItem>
            <ListItem>
              <Text fontWeight='semibold' as='span'>Berechtigtes Interesse (Art. 6 Abs. 1 lit. f): </Text>
              Verbesserung und Absicherung des Dienstes
            </ListItem>
            <ListItem>
              <Text fontWeight='semibold' as='span'>Einwilligung (Art. 6 Abs. 1 lit. a): </Text>
              Soweit im Einzelfall erforderlich
            </ListItem>
          </UnorderedList>
        </LegalSection>

        <LegalSection title='5. Speicherdauer'>
          <UnorderedList spacing={2}>
            <ListItem>Kontodaten: solange dein Konto besteht</ListItem>
            <ListItem>Erzeugte Anschreiben: bis du sie löschst oder dein Konto löschst</ListItem>
            <ListItem>Roh-Lebenslauftext: wird nicht gespeichert (siehe Abschnitt 2)</ListItem>
            <ListItem>Zahlungsbezogene Belege: gemäß gesetzlicher Aufbewahrungspflichten (in Deutschland i. d. R. 10 Jahre)</ListItem>
          </UnorderedList>
        </LegalSection>

        <LegalSection title='6. Deine Rechte nach der DSGVO'>
          <Text mb={4}>Du hast das Recht auf:</Text>
          <UnorderedList spacing={2} mb={4}>
            <ListItem>Auskunft über deine gespeicherten Daten</ListItem>
            <ListItem>Berichtigung unrichtiger Daten</ListItem>
            <ListItem>Löschung ("Recht auf Vergessenwerden")</ListItem>
            <ListItem>Einschränkung der Verarbeitung</ListItem>
            <ListItem>Datenübertragbarkeit</ListItem>
            <ListItem>Widerspruch gegen die Verarbeitung</ListItem>
            <ListItem>Widerruf einer erteilten Einwilligung</ListItem>
          </UnorderedList>
          <Text>
            Zur Ausübung dieser Rechte wende dich an [PLATZHALTER: Kontakt-E-Mail-Adresse].
          </Text>
        </LegalSection>

        <LegalSection title='7. Weitergabe an Dritte'>
          <Text mb={4}>Wir geben Daten an folgende Dienstleister weiter, jeweils nur im nötigen Umfang:</Text>
          <UnorderedList spacing={4} mb={4}>
            <ListItem>
              <Text fontWeight='semibold' as='span'>Google (Login): </Text>
              Für die Anmeldung per Google-Konto
            </ListItem>
            <ListItem>
              <Text fontWeight='semibold' as='span'>OpenAI: </Text>
              Erhält Stellenanzeige und Lebenslauftext zur Erzeugung des Anschreibens; OpenAI kann Anfragen außerhalb der EU (USA) verarbeiten
            </ListItem>
            <ListItem>
              <Text fontWeight='semibold' as='span'>Stripe: </Text>
              Für die Zahlungsabwicklung
            </ListItem>
            <ListItem>
              <Text fontWeight='semibold' as='span'>SendGrid: </Text>
              Für den Versand von Benachrichtigungs-E-Mails (z. B. Hinweis vor Abo-Ablauf)
            </ListItem>
          </UnorderedList>
          <Text>
            Mit allen Dienstleistern, die personenbezogene Daten in unserem Auftrag verarbeiten,
            besteht bzw. muss vor dem Live-Betrieb ein Auftragsverarbeitungsvertrag (AVV) nach
            Art. 28 DSGVO abgeschlossen werden.
          </Text>
        </LegalSection>

        <LegalSection title='8. Datenübermittlung in Drittländer'>
          <Text>
            OpenAI (USA) kann Daten außerhalb der EU verarbeiten. Wir stellen sicher, dass dabei
            geeignete Garantien bestehen, insbesondere EU-Standardvertragsklauseln oder ein
            Angemessenheitsbeschluss der EU-Kommission.
          </Text>
        </LegalSection>

        <LegalSection title='9. Cookies und Tracking'>
          <Text mb={4}>
            Anschreiben Pilot verwendet keine Cookies zu Analyse- oder Werbezwecken. Die
            Anmeldung wird über ein technisch notwendiges Sitzungs-Token verwaltet, das beim
            Abmelden bzw. Schließen des Browsers gelöscht wird.
          </Text>
        </LegalSection>

        <LegalSection title='10. Datensicherheit'>
          <Text mb={4}>Wir setzen angemessene technische und organisatorische Maßnahmen ein, u. a.:</Text>
          <UnorderedList spacing={2}>
            <ListItem>Verschlüsselte Übertragung (HTTPS)</ListItem>
            <ListItem>Zugriffsbeschränkungen und Authentifizierung</ListItem>
            <ListItem>Keine Speicherung von Zahlungsdaten auf eigenen Servern (dies übernimmt Stripe)</ListItem>
          </UnorderedList>
        </LegalSection>

        <LegalSection title='11. Änderungen dieser Datenschutzerklärung'>
          <Text>
            Wir können diese Datenschutzerklärung von Zeit zu Zeit aktualisieren. Änderungen
            werden auf dieser Seite veröffentlicht, das Datum oben wird entsprechend angepasst.
          </Text>
        </LegalSection>

        <LegalSection title='12. Kontakt'>
          <Text mb={4}>
            Bei Fragen zu dieser Datenschutzerklärung oder zur Verarbeitung deiner Daten:
          </Text>
          <UnorderedList spacing={2} mb={4}>
            <ListItem>E-Mail: [PLATZHALTER: Kontakt-E-Mail-Adresse]</ListItem>
            <ListItem>Post: [PLATZHALTER: Adresse]</ListItem>
          </UnorderedList>
          <Text>
            Du hast das Recht, dich bei einer Datenschutz-Aufsichtsbehörde zu beschweren, wenn du
            der Ansicht bist, dass die Verarbeitung deiner Daten gegen die DSGVO verstößt.
          </Text>
        </LegalSection>
      </VStack>
    </BorderBox>
  );
};

export default PrivacyPolicy;
