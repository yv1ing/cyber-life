// 页面配置 - 定义各个管理页面的配置
const PageConfig = {
    accounts: {
        title: 'accounts.title',
        icon: Icons.account,
        api: AccountAPI,
        fields: [
            { key: 'platform', label: 'accounts.platform', type: 'text', required: true },
            { key: 'platform_url', label: 'accounts.platformURL', type: 'url', required: true },
            { key: 'username', label: 'accounts.username', type: 'text', required: true },
            { key: 'password', label: 'accounts.password', type: 'password', required: true },
            { key: 'security_email', label: 'accounts.securityEmail', type: 'email', required: false },
            { key: 'security_phone', label: 'accounts.securityPhone', type: 'tel', required: false },
            { key: 'remark', label: 'accounts.remark', type: 'textarea', required: false }
        ],
        columns: [
            { key: 'ID', label: 'common.id', width: '80px' },
            { key: 'platform', label: 'accounts.platform', width: '120px', format: 'platformLink', urlKey: 'platform_url' },
            { key: 'username', label: 'accounts.username', width: '150px', copyable: true },
            { key: 'password', label: 'accounts.password', width: '200px', format: 'password', copyable: true },
            { key: 'security_email', label: 'accounts.securityEmail', width: '180px', copyable: true },
            { key: 'security_phone', label: 'accounts.securityPhone', width: '130px', copyable: true },
            { key: 'remark', label: 'accounts.remark' },
            { key: 'CreatedAt', label: 'accounts.createdAt', width: '160px', format: 'datetime' },
            { key: 'UpdatedAt', label: 'accounts.updatedAt', width: '160px', format: 'datetime' }
        ]
    },
    hosts: {
        title: 'hosts.title',
        icon: Icons.host,
        api: HostAPI,
        fields: [
            { key: 'provider', label: 'hosts.provider', type: 'text', required: true },
            { key: 'provider_url', label: 'hosts.providerURL', type: 'url', required: true },
            { key: 'address', label: 'hosts.address', type: 'text', required: true },
            { key: 'ports', label: 'hosts.ports', type: 'portlist', required: true },
            { key: 'username', label: 'hosts.username', type: 'text', required: true },
            { key: 'password', label: 'hosts.password', type: 'password', required: true },
            { key: 'hostname_os_group', type: 'group', fields: [
                { key: 'hostname', label: 'hosts.hostname', type: 'text', required: true },
                { key: 'os', label: 'hosts.os', type: 'text', required: false }
            ]},
            { key: 'capacity_group', type: 'group', fields: [
                { key: 'cpu_num', label: 'hosts.cpuCapacity', type: 'capacity', unit: 'cores', placeholder: 'hosts.cpuPlaceholder', required: false },
                { key: 'ram_size', label: 'hosts.ramCapacity', type: 'capacity', unit: 'storage', placeholder: 'hosts.ramPlaceholder', required: false },
                { key: 'disk_size', label: 'hosts.diskCapacity', type: 'capacity', unit: 'storage', placeholder: 'hosts.diskPlaceholder', required: false }
            ]}
        ],
        columns: [
            { key: 'ID', label: 'common.id', width: '80px' },
            { key: 'provider', label: 'hosts.provider', width: '120px', format: 'platformLink', urlKey: 'provider_url' },
            { key: 'hostname', label: 'hosts.hostname', width: '150px' },
            { key: 'address', label: 'hosts.address', width: '150px', copyable: true },
            { key: 'ports', label: 'hosts.ports', width: '150px', format: 'json' },
            { key: 'username', label: 'hosts.username', width: '120px', copyable: true },
            { key: 'password', label: 'hosts.password', width: '150px', format: 'password', copyable: true },
            { key: 'os', label: 'hosts.os', width: '120px' },
            { key: 'cpu_num', label: 'hosts.cpuNum', width: '80px' },
            { key: 'ram_size', label: 'hosts.ramSize', width: '100px', format: 'storage' },
            { key: 'disk_size', label: 'hosts.diskSize', width: '100px', format: 'storage' },
            { key: 'CreatedAt', label: 'hosts.createdAt', width: '160px', format: 'datetime' },
            { key: 'UpdatedAt', label: 'hosts.updatedAt', width: '160px', format: 'datetime' }
        ]
    },
    secrets: {
        title: 'secrets.title',
        icon: Icons.key,
        api: SecretAPI,
        fields: [
            { key: 'platform', label: 'secrets.platform', type: 'text', required: true },
            { key: 'key_id', label: 'secrets.keyID', type: 'text', required: true },
            { key: 'key_secret', label: 'secrets.keySecret', type: 'password', required: true },
            { key: 'remark', label: 'secrets.remark', type: 'textarea', required: false }
        ],
        columns: [
            { key: 'ID', label: 'common.id', width: '80px' },
            { key: 'platform', label: 'secrets.platform', width: '150px' },
            { key: 'key_id', label: 'secrets.keyID', width: '200px', copyable: true },
            { key: 'key_secret', label: 'secrets.keySecret', width: '250px', format: 'password', copyable: true },
            { key: 'remark', label: 'secrets.remark' },
            { key: 'CreatedAt', label: 'secrets.createdAt', width: '160px', format: 'datetime' },
            { key: 'UpdatedAt', label: 'secrets.updatedAt', width: '160px', format: 'datetime' }
        ]
    }
};
