import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface PriceUpdateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedRows: string[];
    percentageIncrease: string;
    setPercentageIncrease: (value: string) => void;
    handlePriceUpdate: () => void;
    isPending: boolean;
}

export function PriceUpdateDialog({
    open,
    onOpenChange,
    selectedRows,
    percentageIncrease,
    setPercentageIncrease,
    handlePriceUpdate,
    isPending
}: PriceUpdateDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Modificación masiva de precios</DialogTitle>
                    <DialogDescription>
                        Actualizar precios de {selectedRows.length} productos seleccionados
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="percentage">Porcentaje de incremento</Label>
                        <div className="flex items-center">
                            <Input
                                id="percentage"
                                value={percentageIncrease}
                                onChange={(e) => setPercentageIncrease(e.target.value)}
                                className="w-24"
                                type="number"
                            />
                            <span className="ml-2">%</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Use valores positivos para incremento y negativos para descuento.
                        </p>
                    </div>

                    <div className="bg-muted p-3 rounded-md max-h-32 overflow-y-auto">
                        <p className="font-medium mb-1">Productos a modificar:</p>
                        {selectedRows.map((id) => (
                            <div key={id} className="text-xs mb-1">
                                <code>{id}</code>
                            </div>
                        ))}
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isPending}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handlePriceUpdate}
                        disabled={isPending}
                    >
                        {isPending ? "Actualizando..." : "Actualizar precios"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
