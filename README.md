## Hinweis
Diese Seite ist eine Kopie von [https://mkleinsb.github.io/pxt-iot-lora-node-calliope/](https://mkleinsb.github.io/pxt-iot-lora-node-calliope/).

Die Blöcke sind etwas übersichtlicher gestaltet, um Schülern der [Realschule plus und FOS im Einrich](https://rs-einrich.de) die Arbeit zu erleichtern.

## Als Erweiterung verwenden
Dieses Repository kann als **Erweiterung** in MakeCode hinzugefügt werden.

* öffne [https://makecode.calliope.cc](https://makecode.calliope.cc)
* klicke auf **Neues Projekt**
* klicke auf **Erweiterungen** unter dem Zahnrad-Menü
* nach **https://github.com/chbmeyer/pxt-iot-lora-node-calliope** suchen und importieren

## Eigene LoRaWAN-Hardwaremodule für MakeCode vorkonfigurieren
Wenn Sie als Lehrer Ihren Schülern den Einstieg erleichtern wollen, dann können Sie in diesem Plugin einmalig Ihren Modulen eine DevEUI und einen AppKey hinterlegen, und diese Modifikation als **schulinterne Erweiterung** (HEX-Datei) an Ihre Schüler weitergeben. Das erspart das umständliche hantieren mit dem Verwalten und Eingeben der langen Zahlenkeys.
Für die Schüler sieht das dann so aus:

![grafik](https://github.com/user-attachments/assets/5b49d557-e684-4e1d-8849-8395314480eb)

<img src="https://github.com/user-attachments/assets/bc0ecb29-0420-4e97-8203-ec962032572a" width="450" />
<img src="https://github.com/user-attachments/assets/96ad02a0-c114-4c09-8d19-4ab954eaa108" width="450" />

### Was muss ich tun?
* natürlich möchte ich unsere schulischen Zugangsdaten nicht öffentlich exponieren, oder ein funktionsloses Plugin auf Github hochladen.
* deshalb müssen Sie **ein wenig** von Hand nacharbeiten
* Sie benötigen dafür bereits existierende DevEUIs und AppKeys von [TheThingsNetwork](https://eu1.cloud.thethings.network/console)
* falls Sie die noch nicht haben, starten Sie bitte zuerst auf der [Lernstrecke zu LoraWAN von inf-schule](https://dev.inf-schule.de/informatiksysteme/calliope/IoT/lorawan/lernstrecke).

#### 1. Dieses Projekt bearbeiten in MakeCode bearbeiten
* öffne [https://makecode.calliope.cc](https://makecode.calliope.cc)
* klicke auf **Importieren** und dann auf **Importiere URL**
* füge **https://github.com/chbmeyer/pxt-iot-lora-node-calliope** ein und klicke auf Importieren

#### 2. Code kopieren und einfügen
* in der Datei modulauswahl.ts habe ich den kompletten Code (natürlich ohne DevEUIs / AppKeys) hinterlegt
* ersetzen Sie damit den in MakeCode geöffneten Code.
* passen Sie im **enmu Modul** (ab Zeile 85) die Namen der Hardware-Module an (, z.B. die selbst vergebenen Namen der "end devices" von TTN). Sie können auch die Anzahl der Einträge einfach selbst ändern und z.B. nicht benötigte Einträge löschen.
* tragen Sie nun für jedes dieser Module ebenfalls den von Ihnen gewählten Namen (ab Zeile 106, hinter **case**) und die passenden **DevEUI** und **AppKey** in den Funktionsuafruf ein. Das sieht dann z.B. so aus: InitialiseRadioOTAA("70B3XXXXXXXXAB34", "D0D9XXXXXXXXXXXXXXXXXXXXXXXXD528")

#### 3. Datei speichern
* tun Sie nun so, als ob Sie das Projekt nun wieder auf github speichern wollten (was Sie mangels meiner Zugangsdaten gar nicht können), indem Sie im unteren Bereich des Make-Code-Browserfensters auf das Github-Logo und den Pfeil nach oben klicken.
* srollen Sie auf der folgenden Seite ganz nach unten. Im "Bereich für Erweiterungen" können Sie zunächst Ihre geänderte "**Erweiterung testen**", und wenn alles funktioniert "**Für den Offline-Gebrauch speichern**".
* Fertig. Diese Datei müssen Sie nun (z.B. durch einen Moodlekurs) an Ihre Schüler verteilen. Zusätzlich habe ich an die Hardware-Module einen **individuellen Anhänger** mit dem Modulnamen, aber auch mit DevEUI und AppKey angebracht.
