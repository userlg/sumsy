import { defineStore } from 'pinia'
import { Summary } from "@/interfaces/Summary";

export const useResumenStore = defineStore('resumen', {
    state: () => ({
        list: [] as Summary[],
        nextId: 1,
        nextElement: 1
    }),
    actions: {
        create(name: string) {
            const dateCurrent = new Date()
            const today = this.formatDate(dateCurrent)

            this.list.push({
                id: this.nextId++,
                name,
                date: today,
                element: this.nextElement++
            })
        },
        getAllSummaries(): Summary[] {
            return this.list
        },
        update(id: number, datos: Partial<Summary>) {
            const idx = this.list.findIndex(r => r.id === id)
            if (idx !== -1) {
                this.list[idx] = { ...this.list[idx], ...datos }
            }
        },
        delete(id: number) {
            this.list = this.list.filter(r => r.id !== id)
        },
        formatDate(date: Date): string {
            const day = String(date.getDate()).padStart(2, '0')
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const year = String(date.getFullYear()).slice(-2)
            return `${day}-${month}-${year}`
        }
    },
    persist: true
})
