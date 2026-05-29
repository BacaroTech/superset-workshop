# Workshop: Business Intelligence con Apache Superset & PostgreSQL

> Ambiente locale dockerizzato per esplorare la creazione di dashboard interattive su dati reali.

---

## Indice

1. [Prerequisiti](#prerequisiti)
2. [Avvio dell'infrastruttura](#avvio-dellinfrastruttura)
3. [Connessione del database a Superset](#connessione-del-database-a-superset)
4. [Connessione con DBeaver](#connessione-con-dbeaver)
5. [Obiettivi del workshop](#obiettivi-del-workshop)
6. [Embedding della dashboard](#embedding-della-dashboard)
7. [Approfondimenti e follow-up](#approfondimenti-e-follow-up)
8. [Riferimento rapido credenziali](#riferimento-rapido-credenziali)

---

## Prerequisiti

Assicurati di avere installato e in esecuzione sul tuo computer:

- **Docker** (Docker Desktop o Rancher) con **Docker Compose**
- **Node.js** v20+ — necessario per avviare il backend e il frontend di embedding
- **DBeaver** — per ispezionare i dati direttamente nel database
- **Visual Studio Code** — editor consigliato per seguire il workshop

---

## Avvio dell'infrastruttura

1. Assicurati che Docker sia avviato.

2. Apri il terminale, posizionati nella cartella del progetto e lancia:

   ```bash
   docker compose up -d
   ```

3. **Attendi 1-2 minuti.** Al primo avvio Superset esegue in background operazioni di inizializzazione: crea il suo database interno, configura i ruoli di sicurezza e installa i driver necessari.

4. Apri il browser all'indirizzo:

   ```
   http://localhost:8088/
   ```

5. Accedi con le credenziali di default:

   | Campo    | Valore  |
   |----------|---------|
   | Username | `admin` |
   | Password | `admin` |

> **Nota:** le credenziali sono configurabili nel file `.env` nella root del progetto.

---

## Connessione del database a Superset

Per analizzare i dati, dobbiamo collegare Superset al database applicativo (`app-db`).

### Passaggi

1. In Superset, vai su **Settings ⚙️** (in alto a destra) → **Database Connections**.
2. Clicca sul pulsante **+ Database** in alto a destra.
3. Seleziona **PostgreSQL** dalla lista.
4. Scorri il modale verso il basso e clicca sul link:
   > *"Connect this database with a SQLAlchemy URI string instead"*
5. Incolla la seguente stringa nel campo:

   ```
   postgresql://app_user:app_password_super_sicura@app-db:5432/app_database
   ```

6. Clicca su **Test Connection** (in basso a destra). Se appare un messaggio di successo verde, clicca su **Connect** per salvare.

### Anatomia della stringa di connessione

```
postgresql://<utente>:<password>@<host>:<porta>/<database>
```

| Componente | Valore              | Note                                                                 |
|------------|---------------------|----------------------------------------------------------------------|
| `utente`   | `app_user`          |                                                                      |
| `password` | `app_password_super_sicura` |                                                           |
| `host`     | `app-db`            | Nome del servizio definito in `docker-compose.yml` (rete interna Docker) |
| `porta`    | `5432`              | Porta standard PostgreSQL                                            |
| `database` | `app_database`      |                                                                      |

> Una volta connesso, puoi usare il tab **SQL Lab** per interrogare i dati ed iniziare a creare i tuoi dataset.

---

## Connessione con DBeaver

DBeaver ti permette di ispezionare i dati grezzi nel database, utile per verificare i valori prima di creare grafici.

### Passaggi

1. Apri DBeaver e seleziona **Nuova connessione**.
2. Scegli **PostgreSQL** come tipo di database.
3. Inserisci i seguenti parametri:

   | Campo      | Valore                       |
   |------------|------------------------------|
   | Host       | `localhost`                  |
   | Porta      | `5432`                       |
   | Database   | `app_database`               |
   | Nome utente| `app_user`                   |
   | Password   | `app_password_super_sicura`  |

4. Clicca su **Test connessione** — se il test ha esito positivo, clicca **Fine**.

> **Nota:** a differenza di Superset (che opera sulla rete Docker interna), DBeaver si connette dall'esterno tramite la porta esposta sull'host locale (`localhost`).

---

## Obiettivi del workshop

Alla fine di questa sessione sarai in grado di:

1. **Creare un dataset** — collegare una query SQL o una tabella a Superset come sorgente dati riutilizzabile.
2. **Creare grafici** — esplorare i diversi tipi di visualizzazione disponibili (bar chart, line chart, pie chart, tabelle pivot, ecc.).
3. **Assemblare una dashboard** — combinare più grafici in un'unica vista interattiva e condivisibile.

---

## Embedding della dashboard

Questa sezione mostra come incorporare una dashboard Superset all'interno di un'applicazione web reale, usando un **backend Express** che gestisce l'autenticazione e un **frontend React** che visualizza la dashboard in un iframe.

> **Infrastruttura Docker non coinvolta** — BE e FE girano direttamente su Node.js, fuori da Docker Compose.

### Prerequisito: abilitare l'embedding in Superset

Prima di tutto devi abilitare la funzionalità di embedding lato Superset:

1. In Superset, vai su **Settings ⚙️** → **Feature flags**.
2. Attiva **EMBEDDED_SUPERSET**.
3. Salva e riavvia Superset se richiesto.

Poi, per ogni dashboard che vuoi incorporare:

1. Apri la dashboard.
2. Clicca su **⋮** (tre puntini in alto a destra) → **Embed dashboard**.
3. Copia l'**UUID** che appare — ti servirà nel frontend.

### Avvio del backend (BE)

```bash
cd be
npm install
npm run dev
```

Il server Express si avvia su `http://localhost:4000`.

**Endpoint disponibili:**

| Metodo | Path            | Descrizione                                        |
|--------|-----------------|----------------------------------------------------|
| `POST` | `/embed/token`  | Riceve `{ dashboardId }`, restituisce `{ token }`  |
| `GET`  | `/health`       | Health check                                       |

### Avvio del frontend (FE)

```bash
cd fe
npm install
npm run dev
```

L'app React si avvia su `http://localhost:3000`.

### Flusso di embedding

```
Browser (FE)
  │
  │  POST /embed/token  { dashboardId }
  ▼
Backend (BE)
  │
  │  POST /api/v1/security/login        → access token
  │  POST /api/v1/security/guest_token/ → guest token
  ▼
Superset (Docker)
  │
  └─ token restituito al FE
       │
       └─ iframe src="localhost:8088/superset/dashboard/<id>?standalone=3&guest_token=<token>"
```

### Struttura dei file

```
fe/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── index.css
    ├── App.jsx
    ├── App.css
    └── components/
        ├── EmbedForm.jsx
        ├── EmbedForm.css
        ├── Dashboard.jsx
        └── Dashboard.css

be/
├── package.json
├── .env.example
└── src/
    └── index.js
```

---

## Approfondimenti e follow-up

- **Gestione degli accessi con i ruoli** — configurare ruoli e permessi per controllare quali utenti possono vedere o modificare dataset e dashboard.
- **Row-Level Security (RLS)** — passare regole RLS nel guest token per filtrare i dati per utente.
- **Refresh automatico del token** — i guest token scadono; in produzione va implementato un meccanismo di rinnovo.

---

## Riferimento rapido credenziali

| Servizio                    | URL / Host    | Porta | Utente     | Password                     |
|-----------------------------|---------------|-------|------------|------------------------------|
| Superset (web)              | `localhost`   | 8088  | `admin`    | `admin`                      |
| PostgreSQL (DBeaver)        | `localhost`   | 5432  | `app_user` | `app_password_super_sicura`  |
| PostgreSQL (interno Docker) | `app-db`      | 5432  | `app_user` | `app_password_super_sicura`  |
| Backend embed               | `localhost`   | 4000  | —          | —                            |
| Frontend embed              | `localhost`   | 3000  | —          | —                            |
