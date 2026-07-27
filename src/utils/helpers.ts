import { InspectionReport, DamageReport, InventoryItem, LinenItem } from '../types';

export const LOCAL_STORAGE_KEY_CURRENT = 'hostclean_current_report_v1';
export const LOCAL_STORAGE_KEY_HISTORY = 'hostclean_reports_history_v1';
export const LOCAL_STORAGE_KEY_PROPERTIES = 'hostclean_properties_v1';

export function formatDateBR(dateString?: string): string {
  if (!dateString) return new Date().toLocaleDateString('pt-BR');
  try {
    const [year, month, day] = dateString.split('-');
    if (year && month && day) return `${day}/${month}/${year}`;
    return new Date(dateString).toLocaleDateString('pt-BR');
  } catch {
    return dateString;
  }
}

export function formatDateTimeBR(isoString?: string): string {
  if (!isoString) return new Date().toLocaleString('pt-BR');
  try {
    return new Date(isoString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export function generateWhatsAppMessage(report: InspectionReport): string {
  const dateStr = formatDateBR(report.inspectionDate);
  const totalRooms = report.rooms.length;
  const completedRooms = report.rooms.filter((r) => r.completed).length;

  let msg = `*RELATÓRIO DE HIGIENIZAÇÃO E VISTORIA*\n`;
  msg += `--------------------------------------\n`;
  msg += `🏠 *Imóvel:* ${report.propertyName}\n`;
  msg += `📍 *Endereço:* ${report.propertyAddress}\n`;
  if (report.wifiName) {
    msg += `📶 *Wi-Fi:* ${report.wifiName} (Senha: ${report.wifiPass || 'Sem senha'})\n`;
  }
  msg += `👤 *Colaborador:* ${report.cleanerName} (${report.cleanerPhone})\n`;
  msg += `📅 *Data:* ${dateStr}\n`;
  msg += `⏱️ *Horário:* Início ${report.startTime}${report.endTime ? ` | Fim ${report.endTime}` : ''}\n`;
  msg += `--------------------------------------\n`;
  msg += `✅ *Progresso dos Ambientes:* ${completedRooms}/${totalRooms} cômodos inspecionados.\n\n`;

  // Linen summary
  const totalLinenInstalled = report.linen.reduce((acc, l) => acc + l.quantityInstalled, 0);
  const totalLinenDamage = report.linen.reduce((acc, l) => acc + l.stainedOrDamagedQty, 0);
  msg += `🧺 *Enxoval & Roupas:* ${totalLinenInstalled} itens instalados limpos.`;
  if (totalLinenDamage > 0) {
    msg += ` ⚠️ *${totalLinenDamage} item(ns) manchados/danificados.*`;
  }
  msg += `\n`;

  // Inventory warnings
  const lowStock = report.inventory.filter((i) => i.status === 'repor' || i.status === 'urgente');
  if (lowStock.length > 0) {
    msg += `\n📦 *ALERTA DE REPOSIÇÃO DE ESTOQUE:* \n`;
    lowStock.forEach((item) => {
      msg += `• ${item.name}: ${item.currentQty} ${item.unit} (Mínimo: ${item.minimumQty})\n`;
    });
  }

  // Damage reports
  if (report.damageReports.length > 0) {
    msg += `\n⚠️ *RELATÓRIO DE AVARIAS (${report.damageReports.length}):*\n`;
    report.damageReports.forEach((dmg, idx) => {
      const sev = dmg.severity === 'grave' ? '🚨 GRAVE' : dmg.severity === 'media' ? '⚠️ MÉDIA' : 'ℹ️ LEVE';
      msg += `${idx + 1}. [${sev}] *${dmg.itemOrArea}* (${dmg.roomName})\n   _${dmg.description}_\n`;
      if (dmg.estimatedCost) {
        msg += `   Valor Estimado: R$ ${dmg.estimatedCost.toFixed(2)}\n`;
      }
    });
  } else {
    msg += `\n✨ *Nenhuma avaria identificada! Imóvel pronto e higienizado.* 🎉\n`;
  }

  if (report.signatureDataUrl) {
    msg += `\n✍️ *Assinatura Digital:* Confirmada e arquivada em sistema.\n`;
  }

  msg += `\n_Gerado via aplicativo de vistoria e limpeza no celular_`;

  return msg;
}

export function generateWhatsAppDamageAlert(report: InspectionReport, damage: DamageReport): string {
  let msg = `🚨 *NOTIFICAÇÃO URGENTE DE AVARIA - IMÓVEL DE TEMPORADA*\n\n`;
  msg += `🏠 *Imóvel:* ${report.propertyName}\n`;
  msg += `📅 *Data:* ${formatDateBR(report.inspectionDate)} - ${report.startTime}\n`;
  msg += `👤 *Identificado Por:* ${report.cleanerName}\n\n`;
  msg += `❌ *Item/Local:* ${damage.itemOrArea} (${damage.roomName})\n`;
  msg += `⚠️ *Gravidade:* ${damage.severity.toUpperCase()}\n`;
  msg += `📝 *Descrição:* ${damage.description}\n`;
  if (damage.estimatedCost) {
    msg += `💰 *Estimativa de Danos:* R$ ${damage.estimatedCost.toFixed(2)}\n`;
  }
  msg += `\n_Por favor, informe como proceder para reposição ou cobrança ao hóspede._`;
  return msg;
}
