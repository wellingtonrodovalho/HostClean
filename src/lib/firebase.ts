import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { Property, InspectionReport } from '../types';
import { INITIAL_PROPERTIES } from '../data/defaultTemplates';
import config from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId,
};

const app = initializeApp(firebaseConfig);
export const db = config.firestoreDatabaseId
  ? getFirestore(app, config.firestoreDatabaseId)
  : getFirestore(app);

const PROPERTIES_COLLECTION = 'properties';
const REPORTS_COLLECTION = 'reports';

/**
 * Escuta em tempo real a lista de imóveis do Firestore.
 * Sincroniza instantaneamente entre todos os celulares/dispositivos.
 */
export function subscribeToProperties(
  onUpdate: (properties: Property[]) => void,
  onError?: (err: Error) => void
) {
  const propsRef = collection(db, PROPERTIES_COLLECTION);
  
  return onSnapshot(
    propsRef,
    async (snapshot) => {
      // Se o banco estiver vazio, semeia os imóveis padrão
      if (snapshot.empty) {
        try {
          const batch = writeBatch(db);
          INITIAL_PROPERTIES.forEach((p) => {
            const pRef = doc(db, PROPERTIES_COLLECTION, p.id);
            batch.set(pRef, p);
          });
          await batch.commit();
        } catch (e) {
          console.error('Erro ao semear imóveis padrão no Firestore:', e);
        }
        onUpdate(INITIAL_PROPERTIES);
        return;
      }

      const items: Property[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          name: data.name || '',
          address: data.address || '',
          wifiName: data.wifiName || '',
          wifiPass: data.wifiPass || '',
        };
      });

      onUpdate(items);
    },
    (error) => {
      console.error('Erro na sincronização de imóveis:', error);
      if (onError) onError(error);
    }
  );
}

/**
 * Salva/Atualiza um imóvel no banco de dados em nuvem.
 */
export async function savePropertyCloud(property: Property): Promise<void> {
  const pRef = doc(db, PROPERTIES_COLLECTION, property.id);
  await setDoc(pRef, property, { merge: true });
}

/**
 * Remove um imóvel do banco em nuvem.
 */
export async function deletePropertyCloud(propertyId: string): Promise<void> {
  const pRef = doc(db, PROPERTIES_COLLECTION, propertyId);
  await deleteDoc(pRef);
}

/**
 * Escuta em tempo real o histórico de relatórios/vistorias.
 */
export function subscribeToReports(
  onUpdate: (reports: InspectionReport[]) => void,
  onError?: (err: Error) => void
) {
  const reportsRef = collection(db, REPORTS_COLLECTION);
  return onSnapshot(
    reportsRef,
    (snapshot) => {
      const items: InspectionReport[] = snapshot.docs.map((d) => d.data() as InspectionReport);
      // Ordena pelos mais recentes
      items.sort((a, b) => new Date(b.inspectionDate).getTime() - new Date(a.inspectionDate).getTime());
      onUpdate(items);
    },
    (error) => {
      console.error('Erro na sincronização de relatórios:', error);
      if (onError) onError(error);
    }
  );
}

/**
 * Salva um relatório de limpeza/vistoria no banco em nuvem.
 */
export async function saveReportCloud(report: InspectionReport): Promise<void> {
  const rRef = doc(db, REPORTS_COLLECTION, report.id);
  await setDoc(rRef, report, { merge: true });
}

/**
 * Deleta um relatório no banco em nuvem.
 */
export async function deleteReportCloud(reportId: string): Promise<void> {
  const rRef = doc(db, REPORTS_COLLECTION, reportId);
  await deleteDoc(rRef);
}
