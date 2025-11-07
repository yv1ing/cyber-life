// 页面配置 - 定义各个管理页面的配置
const PageConfig = {
    accounts: {
        title: 'accounts.title',
        icon: Icons.account,
        api: AccountAPI,
        fields: [
            { key: 'platform_group', type: 'group', fields: [
                { key: 'platform', label: 'accounts.platform', type: 'text', required: true },
                { key: 'platform_url', label: 'accounts.platformURL', type: 'url', required: true }
            ]},
            { key: 'logo', label: 'accounts.logo', type: 'logo', required: false, dependsOn: 'platform' },
            { key: 'account_group', type: 'group', fields: [
                { key: 'username', label: 'accounts.username', type: 'text', required: true },
                { key: 'password', label: 'accounts.password', type: 'password', required: true }
            ]},
            { key: 'security_group', type: 'group', fields: [
                { key: 'security_email', label: 'accounts.securityEmail', type: 'email', required: false },
                { key: 'security_phone', label: 'accounts.securityPhone', type: 'tel', required: false }
            ]},
            { key: 'remark', label: 'accounts.remark', type: 'textarea', required: false }
        ],
        columns: [
            { key: 'platform', label: 'accounts.platform', width: '120px', format: 'platformLink', urlKey: 'platform_url', logoKey: 'logo' },
            { key: 'username', label: 'accounts.username', width: '150px', copyable: true },
            { key: 'password', label: 'accounts.password', width: '200px', format: 'password', copyable: true },
            { key: 'security_email', label: 'accounts.securityEmail', width: '180px', copyable: true },
            { key: 'security_phone', label: 'accounts.securityPhone', width: '130px', copyable: true },
            { key: 'remark', label: 'accounts.remark' }
        ]
    },
    hosts: {
        title: 'hosts.title',
        icon: Icons.host,
        api: HostAPI,
        fields: [
            // 服务商信息：服务商名称 + 服务商链接
            { key: 'provider_group', type: 'group', fields: [
                { key: 'provider', label: 'hosts.provider', type: 'text', required: true },
                { key: 'provider_url', label: 'hosts.providerURL', type: 'url', required: true }
            ]},
            // 主机名称 + 操作系统
            { key: 'hostname_os_group', type: 'group', fields: [
                { key: 'hostname', label: 'hosts.hostname', type: 'text', required: true },
                { key: 'os', label: 'hosts.os', type: 'text', required: false }
            ]},
            // 操作系统图标（单独一行）
            { key: 'logo', label: 'hosts.logo', type: 'logo', required: false, dependsOn: 'os' },
            // 主机地址 + 登录账号 + 登录密码
            { key: 'auth_group', type: 'group', fields: [
                { key: 'address', label: 'hosts.address', type: 'text', required: true },
                { key: 'username', label: 'hosts.username', type: 'text', required: true },
                { key: 'password', label: 'hosts.password', type: 'password', required: true }
            ]},
            // 端口映射（单独一行）
            { key: 'ports', label: 'hosts.ports', type: 'portlist', required: true },
            // 容量信息：CPU + 内存 + 磁盘
            { key: 'capacity_group', type: 'group', fields: [
                { key: 'cpu_num', label: 'hosts.cpuCapacity', type: 'capacity', unit: 'cores', placeholder: 'hosts.cpuPlaceholder', required: false },
                { key: 'ram_size', label: 'hosts.ramCapacity', type: 'capacity', unit: 'storage', placeholder: 'hosts.ramPlaceholder', required: false },
                { key: 'disk_size', label: 'hosts.diskCapacity', type: 'capacity', unit: 'storage', placeholder: 'hosts.diskPlaceholder', required: false }
            ]},
            // 到期时间（单独一行）
            { key: 'expiration_time', label: 'hosts.expirationTime', type: 'datetime', required: false }
        ],
        columns: [
            { key: 'provider', label: 'hosts.provider', width: '120px', format: 'platformLink', urlKey: 'provider_url' },
            { key: 'hostname', label: 'hosts.hostname', width: '150px' },
            { key: 'address', label: 'hosts.address', width: '150px', copyable: true },
            { key: 'ports', label: 'hosts.ports', width: '180px', format: 'portMapping' },
            { key: 'username', label: 'hosts.username', width: '120px', copyable: true },
            { key: 'password', label: 'hosts.password', width: '150px', format: 'password', copyable: true },
            { key: 'os', label: 'hosts.os', width: '120px', format: 'platformLink', logoKey: 'logo', logoPath: '/os-icons' },
            { key: 'hardware_specs', label: 'hosts.hardwareSpecs', width: '120px', format: 'hardwareSpecs', cpuKey: 'cpu_num', ramKey: 'ram_size', diskKey: 'disk_size' },
            { key: 'expiration_time', label: 'hosts.expirationTime', width: '160px', format: 'datetime' }
        ]
    },
    secrets: {
        title: 'secrets.title',
        icon: Icons.key,
        api: SecretAPI,
        fields: [
            { key: 'platform_group', type: 'group', fields: [
                { key: 'platform', label: 'secrets.platform', type: 'text', required: true },
                { key: 'platform_url', label: 'secrets.platformURL', type: 'url', required: true }
            ]},
            { key: 'logo', label: 'secrets.logo', type: 'logo', required: false, dependsOn: 'platform' },
            { key: 'key_id', label: 'secrets.keyID', type: 'text', required: true },
            { key: 'key_secret', label: 'secrets.keySecret', type: 'password', required: true },
            { key: 'remark', label: 'secrets.remark', type: 'textarea', required: false }
        ],
        columns: [
            { key: 'platform', label: 'secrets.platform', width: '150px', format: 'platformLink', urlKey: 'platform_url', logoKey: 'logo' },
            { key: 'key_id', label: 'secrets.keyID', width: '200px', copyable: true },
            { key: 'key_secret', label: 'secrets.keySecret', width: '250px', format: 'password', copyable: true },
            { key: 'remark', label: 'secrets.remark' }
        ]
    },
    sites: {
        title: 'sites.title',
        icon: Icons.web,
        api: SiteAPI,
        fields: [
            { key: 'name', label: 'sites.name', type: 'text', required: true },
            { key: 'url', label: 'sites.url', type: 'url', required: true },
            { key: 'logo', label: 'sites.logo', type: 'logo', required: false, dependsOn: 'name', uploadType: 'site' }
        ],
        columns: [
            { key: 'name', label: 'sites.name', width: '200px', format: 'platformLink', urlKey: 'url', logoKey: 'logo', logoPath: '/site-icons' },
            { key: 'url', label: 'sites.url', copyable: true }
        ]
    }
};
