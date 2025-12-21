"use server";
import { getBalance } from "./getBalance";
import { getOnRampTransactions, getP2PTranssactions } from "./getTransactions";

export async function getDashboardData() {
    // Parallel Execution
    const [balance, onRampTxns, p2pTxns] = await Promise.all([
        getBalance(),
        getOnRampTransactions(5, 0),
        getP2PTranssactions(20, 0)
    ]);

    const allTransactions = [
        ...onRampTxns.map(t => ({
            id: `ramp-${t.id}`,
            type: t.type,
            amount: t.amount,
            date: t.date,
            status: t.status,
            description: `Added via ${t.provider}`
        })),
        ...p2pTxns.map(t => ({
            id: `p2p-${t.id}`,
            type: t.type,
            amount: t.amount,
            date: t.date,
            status: t.status,
            description: t.type === 'sent' ? `Sent to ${t.user}` : `Received from ${t.user}`
        }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);


    const contactsMap = new Map();

    p2pTxns
        .filter(t => t.type === 'sent')
        .forEach(t => {
            if (t.userNumber && !contactsMap.has(t.userNumber)) {
                contactsMap.set(t.userNumber, {
                    name: t.user,
                    number: t.userNumber,
                    initials: t.user.slice(0, 2).toUpperCase()
                })
            }
        })
    const recentContacts = Array.from(contactsMap.values()).slice(0, 10);

    return {
        balance,
        transactions: allTransactions,
        contacts: recentContacts
    }    
}