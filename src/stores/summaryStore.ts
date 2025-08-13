import { defineStore } from 'pinia'
import { Summary } from "@/interfaces/Summary";

export const useResumenStore = defineStore('summary', {
    state: () => ({
        list: [] as Summary[],
        nextId: 1,
        nextElement: 1,
        isReversed: false, // indica si la lista está invertida
    }),
    actions: {
        create(name: string): void {
            const dateCurrent = new Date()
            const today = this.formatDate(dateCurrent)

            this.list.push({
                id: this.nextId++,
                name,
                date: today,
                element: this.nextElement++
            })

            this.reindexAndSort()
        },

        getAllSummaries(): Summary[] {
            return this.list
        },

        reverseList(): void {
            // Creamos un nuevo array para que Vue detecte el cambio
            this.list = [...this.list].reverse();
            this.isReversed = !this.isReversed;
        },

        update(id: number, datos: Partial<Summary>): void {
            const idx = this.list.findIndex(r => r.id === id)
            if (idx !== -1) {
                this.list[idx] = { ...this.list[idx], ...datos }
                this.reindexAndSort()
            }
        },
        updateName(id: number, newName: string) {
            const summary = this.list.find(s => s.id === id);
            if (summary) summary.name = newName;
        },
        delete(id: number): void {
            this.list = this.list.filter(r => r.id !== id)
            this.reindexAndSort()
        },

        clearAll(): void {
            this.list = []
            this.nextId = 1
            this.nextElement = 1
            this.isReversed = false
        },

        reindexAndSort(): void {
            // Ordenar siempre de forma ascendente por elemento
            this.list.sort((a, b) => a.element - b.element);

            // Reindexar elementos
            this.list.forEach((item, index) => {
                item.element = index + 1;
            });

            this.nextElement = this.list.length + 1;

            // Si estaba invertida, invertir de nuevo para mantener el orden
            if (this.isReversed) {
                this.list = [...this.list].reverse();
            }
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
