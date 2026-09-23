import BorderBox from '../components/BorderBox';
import { useEffect } from 'react';
import LegalSection from './components/legalSection';
import {
  Heading,
  Text,
  VStack,
  UnorderedList,
  ListItem,
  Link,
  Box
} from '@chakra-ui/react';

// TODO(Saskia): this is a real draft, not a translated version of the template's
// placeholder text anymore — that text named a different company's real name, home
// address and email (the original repo author's), which had to be removed outright.
// Still needed before this goes live:
// 1. Fill in [PLATZHALTER] below — for the Impressum section (§5 TMG/DDG in Germany)
//    this is a LEGAL REQUIREMENT, not optional, and it must be your real, verifiable
//    identity/address, not a placeholder left in place.
// 2. An actual lawyer's review — this is a solid-faith draft, not legal advice.
// 3. Decide your actual pricing/currency before section 5 is accurate.
const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <BorderBox>
      <VStack maxW='4xl' mx='auto' p={6} spacing={6} align='flex-start'>
        <Heading as='h1' size='xl' mb={6}>Nutzungsbedingungen</Heading>
        <Text fontSize='sm' color='gray.600' mb={6}>Zuletzt aktualisiert: {new Date().toLocaleDateString('de-DE')}</Text>

        <LegalSection title='1. Anbieterkennzeichnung (Impressum)'>
          <Text>
            [PLATZHALTER: Vor- und Nachname bzw. Firmenname]
            <br />
            [PLATZHALTER: Adresse]
            <br />
            E-Mail: [PLATZHALTER: Kontakt-E-Mail-Adresse]
          </Text>
        </LegalSection>

        <LegalSection title='2. Leistungsbeschreibung'>
          <Text>
            Anschreiben Pilot ist ein Dienst, der mithilfe von KI-Technologie individuelle
            Anschreiben auf Basis von Lebenslauf und Stellenanzeige erstellt. Der Dienst wird
            aus Deutschland/Österreich angeboten und unterliegt deutschem Recht.
          </Text>
        </LegalSection>

        <LegalSection title='3. Vertragsschluss'>
          <Text>Mit der Registrierung kommt ein Nutzungsvertrag mit [PLATZHALTER: Anbietername] zustande.</Text>
        </LegalSection>

        <LegalSection title='4. Nutzerkonto'>
          <Text>Für die Nutzung ist die Anmeldung per Google-Konto erforderlich. Du bist für die Sicherheit deines Google-Kontos selbst verantwortlich.</Text>
        </LegalSection>

        <LegalSection title='5. Preise und Zahlungsbedingungen'>
          <Text>
            [PLATZHALTER: tatsächliche Preise, Währung und Abrechnungsintervall eintragen,
            sobald das Stripe-Konto und die eigenen Produkt-IDs eingerichtet sind — dieser
            Abschnitt ist aktuell nicht ausgefüllt]. Preise für Kund:innen in der EU verstehen
            sich inklusive gesetzlicher Umsatzsteuer.
          </Text>
        </LegalSection>

        <LegalSection title='6. Widerrufsrecht und Muster-Widerrufsformular'>
          <VStack spacing={6} align='stretch'>
            <Box>
              <Text>
                Verbraucher:innen innerhalb der EU haben das Recht, binnen 14 Tagen ohne Angabe
                von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt 14 Tage ab
                dem Tag des Vertragsschlusses.
              </Text>

              <Text mt={4}>
                Um dein Widerrufsrecht auszuüben, musst du uns mittels einer eindeutigen
                Erklärung (z. B. per Post oder E-Mail) über deinen Entschluss informieren. Du
                kannst dafür das untenstehende Muster-Widerrufsformular verwenden, das ist aber
                nicht vorgeschrieben.
              </Text>

              <Text mt={4}>
                Zur Wahrung der Widerrufsfrist reicht es aus, dass du die Mitteilung über die
                Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absendest.
              </Text>

              <Text mt={4}>
                Folgen des Widerrufs: Im Falle eines wirksamen Widerrufs erstatten wir dir alle
                Zahlungen, die wir von dir erhalten haben, unverzüglich und spätestens binnen 14
                Tagen ab dem Tag, an dem die Mitteilung über deinen Widerruf bei uns eingegangen
                ist.
              </Text>
            </Box>

            <Box p={4} borderWidth={1} borderRadius='lg' bg='bg-contrast-sm'>
              <Text fontWeight='semibold' mb={4}>
                Muster-Widerrufsformular
              </Text>
              <Text mb={4}>
                (Bitte nur ausfüllen und zurücksenden, wenn du den Vertrag widerrufen möchtest)
              </Text>
              <VStack align='stretch' spacing={4} color='text-contrast-lg'>
                <Box>
                  <Text fontWeight='medium'>An:</Text>
                  <Text>[PLATZHALTER: Anbietername]</Text>
                  <Text>[PLATZHALTER: Adresse]</Text>
                  <Text>E-Mail: [PLATZHALTER: Kontakt-E-Mail-Adresse]</Text>
                </Box>

                <Text>
                  Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag
                  über die Erbringung folgender Dienstleistung: Anschreiben Pilot Abonnement.
                </Text>

                <UnorderedList spacing={2} pl={4}>
                  <ListItem>Bestellt am (*)/erhalten am (*)</ListItem>
                  <ListItem>Name der/des Verbraucher(s)</ListItem>
                  <ListItem>Anschrift der/des Verbraucher(s)</ListItem>
                  <ListItem>Unterschrift (nur bei Mitteilung auf Papier)</ListItem>
                  <ListItem>Datum</ListItem>
                </UnorderedList>

                <Text fontSize='sm' fontStyle='italic'>
                  (*) Unzutreffendes streichen
                </Text>
              </VStack>
            </Box>
          </VStack>
        </LegalSection>

        <LegalSection title='7. Streitbeilegung'>
          <Text>
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS)
            bereit, abrufbar unter https://ec.europa.eu/consumers/odr/. Wir sind nicht
            verpflichtet und nicht bereit, an einem Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.
          </Text>
        </LegalSection>

        <LegalSection title='8. Anwendbares Recht'>
          <Text>Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts.</Text>
        </LegalSection>

        <LegalSection title='9. Nutzung des Dienstes'>
          <Text>
            Anschreiben Pilot erstellt KI-gestützte Anschreiben. Mit der Nutzung erkennst du an:
          </Text>
          <UnorderedList spacing={2} pl={5}>
            <ListItem>
              Erzeugte Anschreiben sind als Entwurf gedacht und sollten vor dem Versand
              durchgelesen und persönlich angepasst werden.
            </ListItem>
            <ListItem>
              Wir behalten uns vor, den Zugang bei Missbrauch oder Verstoß gegen diese
              Bedingungen einzuschränken oder zu sperren.
            </ListItem>
            <ListItem>
              Du bist für die Vertraulichkeit deiner Zugangsdaten selbst verantwortlich.
            </ListItem>
          </UnorderedList>
        </LegalSection>

        <LegalSection title='10. Haftungsausschluss'>
          <Text>
            Im gesetzlich zulässigen Umfang gilt:
          </Text>
          <UnorderedList spacing={2} pl={5}>
            <ListItem>
              Die erzeugten Anschreiben werden ohne Gewähr für Richtigkeit, Vollständigkeit oder
              Eignung für einen bestimmten Zweck bereitgestellt.
            </ListItem>
            <ListItem>
              Du bist selbst dafür verantwortlich, erzeugte Inhalte zu prüfen, bevor du sie für
              eine Bewerbung verwendest.
            </ListItem>
            <ListItem>
              Wir haften nicht für entgangene Bewerbungschancen, abgelehnte Bewerbungen oder
              sonstige mittelbare Folgen der Nutzung des Dienstes, außer bei Vorsatz oder grober
              Fahrlässigkeit.
            </ListItem>
            <ListItem>
              Unsere Haftung ist, soweit gesetzlich zulässig, auf den in den letzten 12 Monaten
              gezahlten Betrag begrenzt.
            </ListItem>
          </UnorderedList>
        </LegalSection>

        <LegalSection title='11. Geistiges Eigentum'>
          <UnorderedList spacing={2} pl={5}>
            <ListItem>
              Software, Design und Funktionsweise des Dienstes bleiben Eigentum von
              [PLATZHALTER: Anbietername].
            </ListItem>
            <ListItem>
              Du erhältst ein einfaches, nicht übertragbares Nutzungsrecht an den für dich
              erzeugten Anschreiben zur eigenen, persönlichen Verwendung.
            </ListItem>
          </UnorderedList>
        </LegalSection>

        <LegalSection title="12. Sicherheit der Zahlung">
          <Text>
            Anschreiben Pilot verarbeitet keine Zahlungsdaten direkt. Sämtliche Zahlungen werden
            über Stripe abgewickelt:
          </Text>
          <UnorderedList spacing={2} pl={5}>
            <ListItem>
              Deine Zahlungsdaten werden nicht auf unseren Servern gespeichert.
            </ListItem>
            <ListItem>
              Alle Zahlungsvorgänge werden von Stripe verschlüsselt und sicher verarbeitet.
            </ListItem>
            <ListItem>
              Mehr zu den Sicherheitsmaßnahmen von Stripe:{' '}
              <Link
                href="https://stripe.com/docs/security"
                target="_blank"
                rel="noopener noreferrer"
                color="purple.600"
                _hover={{ color: 'purple.800' }}
              >
                Stripe-Sicherheitsdokumentation
              </Link>
            </ListItem>
          </UnorderedList>
        </LegalSection>
      </VStack>
    </BorderBox>
  );
};

export default TermsOfService;
