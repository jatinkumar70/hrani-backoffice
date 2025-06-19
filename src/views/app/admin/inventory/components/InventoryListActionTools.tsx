const InventoryListActionTools = () => {
    return (
        <div className="flex flex-col md:flex-row gap-3">
            {/* <CSVLink
                data={csvData}
                filename="vouchers.csv"
                className="w-full"
                asyncOnClick={true}
            >
                <Button
                    icon={<TbCloudDownload className="text-xl" />}
                    className="w-full"
                    disabled={!data || data.length === 0}
                >
                    Download
                </Button>
            </CSVLink> */}

            {/* <Button
                variant="solid"
                icon={<TbPlus className="text-xl" />}
                onClick={() => setDialogOpen(true)}
            >
                Add Promo Code
            </Button>

            <Dialog isOpen={dialogOpen} onClose={() => setDialogOpen(false)}>
                <h4>Add New Promo Code</h4>
                <div className="mt-4">
                    <NewVoucherForm onClose={() => setDialogOpen(false)} />
                </div>
            </Dialog> */}
        </div>
    )
}

export default InventoryListActionTools
