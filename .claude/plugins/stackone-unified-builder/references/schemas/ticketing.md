# Ticketing — Schema Reference

> Manage tickets, projects, collections and users.

> **OAS source:** `https://docs.stackone.com/ticketing/api-reference/ticketing.json`

---

## Endpoints

| Method | Path | Summary |
|--------|------|---------|
| `GET` | `/unified/ticketing/tickets` | List Tickets |
| `POST` | `/unified/ticketing/tickets` | Create Ticket |
| `GET` | `/unified/ticketing/tickets/{id}` | Get Ticket |
| `PATCH` | `/unified/ticketing/tickets/{id}` | Update Ticket |
| `GET` | `/unified/ticketing/users` | List Users |
| `GET` | `/unified/ticketing/users/{id}` | Get User |
| `GET` | `/unified/ticketing/tickets/{id}/comments` | List Comments |
| `GET` | `/unified/ticketing/tickets/{id}/comments/{subResourceId}` | Get Comment |
| `GET` | `/unified/ticketing/tickets/{id}/attachments/{subResourceId}/download` | Download Attachment |
| `GET` | `/unified/ticketing/tickets/{id}/attachments` | List Attachments |
| `GET` | `/unified/ticketing/tickets/{id}/attachments/{subResourceId}` | Get Attachment |
| `GET` | `/unified/ticketing/ticket_types` | List Ticket Types |
| `GET` | `/unified/ticketing/ticket_types/{id}` | Get Ticket Type |
| `GET` | `/unified/ticketing/projects` | List Projects |
| `GET` | `/unified/ticketing/projects/{id}` | Get Project |
| `GET` | `/unified/ticketing/projects/{id}/components` | List Project Components |
| `GET` | `/unified/ticketing/projects/{id}/components/{subResourceId}` | Get Project Component |
| `GET` | `/unified/ticketing/projects/{id}/ticket_types` | List Project Ticket Types |
| `GET` | `/unified/ticketing/tickets/{id}/statuses` | List Ticket Statuses |

---

## Models

### `ProviderError`
| Field | Type | Description |
|-------|------|-------------|
| `status` | `number` | HTTP status code of the provider error |
| `url` | `string` | URL that caused the error |
| `raw` | `object` | Raw error response from the provider |
| `headers` | `object` | Response headers |

### `TicketingAttachment`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `ticket_id` | `string` | The reference ticket ID the attachment belongs to |
| `user_id` | `string` | The user who uploaded the file |
| `file_name` | `string` | The name of the file |
| `file_format` | `FileFormatEnum` | The type of the file |
| `file_url` | `string` | The resource URL of the file |
| `size` | `number` | The size of the file |
| `created_at` | `string` | The timestamp when the record was created |
| `updated_at` | `string` | The timestamp when the record was last updated |

### `TicketingComment`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `ticket_id` | `string` | The ticket ID associated with the comment |
| `user_id` | `string` | The user who created the comment |
| `internal` | `object` | Whether the comment is internal |
| `content` | `array<TicketingContent>` | Array of content associated with the comment |
| `created_at` | `string` | The timestamp when the record was created |
| `updated_at` | `string` | The timestamp when the record was last updated |

### `TicketingComponent`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `organization_id` | `string` | The organization id related to the component |
| `project_id` | `string` | The project id related to the component |
| `name` | `string` | The name of the component |
| `description` | `string` | The description of the component |
| `created_at` | `string` | The timestamp when the record was created |
| `updated_at` | `string` | The timestamp when the record was last updated |

### `TicketingContent`
| Field | Type | Description |
|-------|------|-------------|
| `plain` | `string` | The content of the ticket |
| `html` | `string` | The HTML content of the ticket |

### `TicketingOrganization`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `domain` | `string` | The domain of the organization |
| `name` | `string` | The name of the organization |

### `TicketingProject`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `name` | `string` | The name of the project |
| `description` | `string` | The description of the project |
| `organization_id` | `string` | The organization id related to the project |
| `created_at` | `string` | The timestamp when the record was created |
| `updated_at` | `string` | The timestamp when the record was last updated |

### `TicketingReadTicket`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `unified_custom_fields` | `object` | Custom Unified Fields configured in your StackOne project |
| `title` | `string` | The title or subject of the ticket |
| `creator_id` | `string` | The creator of the ticket |
| `reporters` | `array<string>` | Users who reported the ticket |
| `assignees` | `array<string>` | Agents assigned to the ticket |
| `content` | `array<TicketingContent>` | Array of content associated with the ticket |
| `parent_id` | `string` | ID of the parent ticket if this is a sub-ticket |
| `priority` | `TicketingTicketPriorityTypeEnum` | Priority of the ticket |
| `tags` | `array<string>` | The tags of the ticket |
| `projects` | `array<TicketingProject>` | Projects the ticket belongs to |
| `ticket_number` | `string` | The unique ticket number or reference ID |
| `type` | `TicketingTicketType` | The type of the ticket |
| `closed_at` | `string` | The date the ticket was closed |
| `ticket_url` | `string` | URL to view the ticket in the source system |
| `status` | `TicketingTicketStatus` | Current status of the ticket |
| `organization` | `TicketingOrganization` | Organization associated with the ticket |
| `components` | `array<TicketingComponent>` | Components associated with the ticket |
| `created_at` | `string` | The timestamp when the record was created |
| `updated_at` | `string` | The timestamp when the record was last updated |

### `TicketingTicketStatus`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | The id of the ticket status. |
| `type` | `TicketingTicketStatusTypeEnum` | The type of this status |
| `name` | `string` | The name of the ticket status. |

### `TicketingTicketType`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | The id of the ticket type. |
| `name` | `string` | The name of the ticket type. |
| `project_id` | `string` | The project the ticket type belongs to. |

### `TicketingUser`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `type` | `TicketingUserTypeEnum` |  |
| `name` | `string` | John Doe |
| `primary_email` | `string` | The user's primary email address |
| `primary_phone` | `string` | The user's primary phone number |
| `username` | `string` | The username of the user in the provider system |
| `active` | `object` | If the user is active |
| `first_name` | `string` | The first name of the user |
| `last_name` | `string` | The last name of the user |
| `customer_account_reference` | `string` | The unique account reference assigned as an external user (e.g. the customer account identifier r... |
| `created_at` | `string` | The timestamp when the record was created |
| `updated_at` | `string` | The timestamp when the record was last updated |

### `UnifiedError`
| Field | Type | Description |
|-------|------|-------------|
| `statusCode` | `number` | HTTP status code |
| `message` | `string` | Error message |
| `headers` | `object` | Response headers |

---

## Enums

| Enum | Values |
|------|--------|
| `FileFormatEnum` | `ez`, `aw`, `atom`, `atomcat`, `atomdeleted`, `atomsvc`, `dwd`, `held`, `rsat`, `bdoc`, `xcs`, `ccxml`, `cdfx`, `cdmia`, `cdmic`, `cdmid`, `cdmio`, `cdmiq`, `cu`, `mpd`, `davmount`, `dbk`, `dssc`, `xdssc`, `es`, `ecma`, `emma`, `emotionml`, `epub`, `exi`, `exp`, `fdt`, `pfr`, `geojson`, `gml`, `gpx`, `gxf`, `gz`, `hjson`, `stk`, `ink`, `inkml`, `ipfix`, `its`, `jar`, `war`, `ear`, `ser`, `class`, `js`, `mjs`, `json`, `map`, `json5`, `jsonml`, `jsonld`, `lgr`, `lostxml`, `hqx`, `cpt`, `mads`, `webmanifest`, `mrc`, `mrcx`, `ma`, `nb`, `mb`, `mathml`, `mbox`, `mscml`, `metalink`, `meta4`, `mets`, `maei`, `musd`, `mods`, `m21`, `mp21`, `mp4s`, `m4p`, `doc`, `dot`, `mxf`, `nq`, `nt`, `cjs`, `bin`, `dms`, `lrf`, `mar`, `so`, `dist`, `distz`, `pkg`, `bpk`, `dump`, `elc`, `deploy`, `exe`, `dll`, `deb`, `dmg`, `iso`, `img`, `msi`, `msp`, `msm`, `buffer`, `oda`, `opf`, `ogx`, `omdoc`, `onetoc`, `onetoc2`, `onetmp`, `onepkg`, `oxps`, `relo`, `xer`, `pdf`, `pgp`, `asc`, `sig`, `prf`, `p10`, `p7m`, `p7c`, `p7s`, `p8`, `ac`, `cer`, `crl`, `pkipath`, `pki`, `pls`, `ai`, `eps`, `ps`, `provx`, `pskcxml`, `raml`, `rdf`, `owl`, `rif`, `rnc`, `rl`, `rld`, `rs`, `rapd`, `sls`, `rusd`, `gbr`, `mft`, `roa`, `rsd`, `rss`, `rtf`, `sbml`, `scq`, `scs`, `spq`, `spp`, `sdp`, `senmlx`, `sensmlx`, `setpay`, `setreg`, `shf`, `siv`, `sieve`, `smi`, `smil`, `rq`, `srx`, `gram`, `grxml`, `sru`, `ssdl`, `ssml`, `swidtag`, `tei`, `teicorpus`, `tfi`, `tsd`, `toml`, `trig`, `ttml`, `ubj`, `rsheet`, `td`, `vxml`, `wasm`, `wgt`, `hlp`, `wsdl`, `wspolicy`, `xaml`, `xav`, `xca`, `xdf`, `xel`, `xns`, `xenc`, `xhtml`, `xht`, `xlf`, `xml`, `xsl`, `xsd`, `rng`, `dtd`, `xop`, `xpl`, `*xsl`, `xslt`, `xspf`, `mxml`, `xhvml`, `xvml`, `xvm`, `yang`, `yin`, `zip`, `*3gpp`, `adp`, `amr`, `au`, `snd`, `mid`, `midi`, `kar`, `rmi`, `mxmf`, `*mp3`, `m4a`, `mp4a`, `mpga`, `mp2`, `mp2a`, `mp3`, `m2a`, `m3a`, `oga`, `ogg`, `spx`, `opus`, `s3m`, `sil`, `wav`, `*wav`, `weba`, `xm`, `ttc`, `otf`, `ttf`, `woff`, `woff2`, `exr`, `apng`, `avif`, `bmp`, `cgm`, `drle`, `emf`, `fits`, `g3`, `gif`, `heic`, `heics`, `heif`, `heifs`, `hej2`, `hsj2`, `ief`, `jls`, `jp2`, `jpg2`, `jpeg`, `jpg`, `jpe`, `jph`, `jhc`, `jpm`, `jpx`, `jpf`, `jxr`, `jxra`, `jxrs`, `jxs`, `jxsc`, `jxsi`, `jxss`, `ktx`, `ktx2`, `png`, `sgi`, `svg`, `svgz`, `t38`, `tif`, `tiff`, `tfx`, `webp`, `wmf`, `disposition-notification`, `u8msg`, `u8dsn`, `u8mdn`, `u8hdr`, `eml`, `mime`, `3mf`, `gltf`, `glb`, `igs`, `iges`, `msh`, `mesh`, `silo`, `mtl`, `obj`, `stpx`, `stpz`, `stpxz`, `stl`, `wrl`, `vrml`, `*x3db`, `x3dbz`, `x3db`, `*x3dv`, `x3dvz`, `x3d`, `x3dz`, `x3dv`, `appcache`, `manifest`, `ics`, `ifb`, `coffee`, `litcoffee`, `css`, `csv`, `html`, `htm`, `shtml`, `jade`, `jsx`, `less`, `markdown`, `md`, `mml`, `mdx`, `n3`, `txt`, `text`, `conf`, `def`, `list`, `log`, `in`, `ini`, `rtx`, `*rtf`, `sgml`, `sgm`, `shex`, `slim`, `slm`, `spdx`, `stylus`, `styl`, `tsv`, `t`, `tr`, `roff`, `man`, `me`, `ms`, `ttl`, `uri`, `uris`, `urls`, `vcard`, `vtt`, `*xml`, `yaml`, `yml`, `3gp`, `3gpp`, `3g2`, `h261`, `h263`, `h264`, `m4s`, `jpgv`, `*jpm`, `jpgm`, `mj2`, `mjp2`, `ts`, `mp4`, `mp4v`, `mpg4`, `mpeg`, `mpg`, `mpe`, `m1v`, `m2v`, `ogv`, `qt`, `mov`, `webm`, `cww`, `1km`, `plb`, `psb`, `pvb`, `tcap`, `pwn`, `aso`, `imp`, `acu`, `atc`, `acutc`, `air`, `fcdt`, `fxp`, `fxpl`, `xdp`, `xfdf`, `ahead`, `azf`, `azs`, `azw`, `acc`, `ami`, `apk`, `cii`, `fti`, `atx`, `mpkg`, `key`, `m3u8`, `numbers`, `pages`, `pkpass`, `swi`, `iota`, `aep`, `bmml`, `mpm`, `bmi`, `rep`, `cdxml`, `mmd`, `cdy`, `csl`, `cla`, `rp9`, `c4g`, `c4d`, `c4f`, `c4p`, `c4u`, `c11amc`, `c11amz`, `csp`, `cdbcmsg`, `cmc`, `clkx`, `clkk`, `clkp`, `clkt`, `clkw`, `wbs`, `pml`, `ppd`, `car`, `pcurl`, `dart`, `rdz`, `dbf`, `uvf`, `uvvf`, `uvd`, `uvvd`, `uvt`, `uvvt`, `uvx`, `uvvx`, `uvz`, `uvvz`, `fe_launch`, `dna`, `mlp`, `mle`, `dpg`, `dfac`, `kpxx`, `ait`, `svc`, `geo`, `mag`, `nml`, `esf`, `msf`, `qam`, `slt`, `ssf`, `es3`, `et3`, `ez2`, `ez3`, `fdf`, `mseed`, `seed`, `dataless`, `gph`, `ftc`, `fm`, `frame`, `maker`, `book`, `fnc`, `ltf`, `fsc`, `oas`, `oa2`, `oa3`, `fg5`, `bh2`, `ddd`, `xdw`, `xbd`, `fzs`, `txd`, `ggb`, `ggt`, `gex`, `gre`, `gxt`, `g2w`, `g3w`, `gmx`, `gdoc`, `gslides`, `gsheet`, `kml`, `kmz`, `gqf`, `gqs`, `gac`, `ghf`, `gim`, `grv`, `gtm`, `tpl`, `vcg`, `hal`, `zmm`, `hbci`, `les`, `hpgl`, `hpid`, `hps`, `jlt`, `pcl`, `pclxl`, `sfd-hdstx`, `mpy`, `afp`, `listafp`, `list3820`, `irm`, `sc`, `icc`, `icm`, `igl`, `ivp`, `ivu`, `igm`, `xpw`, `xpx`, `i2g`, `qbo`, `qfx`, `rcprofile`, `irp`, `xpr`, `fcs`, `jam`, `rms`, `jisp`, `joda`, `ktz`, `ktr`, `karbon`, `chrt`, `kfo`, `flw`, `kon`, `kpr`, `kpt`, `ksp`, `kwd`, `kwt`, `htke`, `kia`, `kne`, `knp`, `skp`, `skd`, `skt`, `skm`, `sse`, `lasxml`, `lbd`, `lbe`, `apr`, `pre`, `nsf`, `org`, `scm`, `lwp`, `portpkg`, `mvt`, `mcd`, `mc1`, `cdkey`, `mwf`, `mfm`, `flo`, `igx`, `mif`, `daf`, `dis`, `mbk`, `mqy`, `msl`, `plc`, `txf`, `mpn`, `mpc`, `xul`, `cil`, `cab`, `xls`, `xlm`, `xla`, `xlc`, `xlt`, `xlw`, `xlam`, `xlsb`, `xlsm`, `xltm`, `eot`, `chm`, `ims`, `lrm`, `thmx`, `msg`, `cat`, `*stl`, `ppt`, `pps`, `pot`, `ppam`, `pptm`, `sldm`, `ppsm`, `potm`, `mpp`, `mpt`, `docm`, `dotm`, `wps`, `wks`, `wcm`, `wdb`, `wpl`, `xps`, `mseq`, `mus`, `msty`, `taglet`, `nlu`, `ntf`, `nitf`, `nnd`, `nns`, `nnw`, `*ac`, `ngdat`, `n-gage`, `rpst`, `rpss`, `edm`, `edx`, `ext`, `odc`, `otc`, `odb`, `odf`, `odft`, `odg`, `otg`, `odi`, `oti`, `odp`, `otp`, `ods`, `ots`, `odt`, `odm`, `ott`, `oth`, `xo`, `dd2`, `obgx`, `oxt`, `osm`, `pptx`, `sldx`, `ppsx`, `potx`, `xlsx`, `xltx`, `docx`, `dotx`, `mgp`, `dp`, `esa`, `pdb`, `pqa`, `oprc`, `paw`, `str`, `ei6`, `efif`, `wg`, `plf`, `pbd`, `box`, `mgz`, `qps`, `ptid`, `qxd`, `qxt`, `qwd`, `qwt`, `qxl`, `qxb`, `rar`, `bed`, `mxl`, `musicxml`, `cryptonote`, `cod`, `rm`, `rmvb`, `link66`, `st`, `see`, `sema`, `semd`, `semf`, `ifm`, `itp`, `iif`, `ipk`, `twd`, `twds`, `mmf`, `teacher`, `fo`, `sdkm`, `sdkd`, `dxp`, `sfs`, `sdc`, `sda`, `sdd`, `smf`, `sdw`, `vor`, `sgl`, `smzip`, `sm`, `wadl`, `sxc`, `stc`, `sxd`, `std`, `sxi`, `sti`, `sxm`, `sxw`, `sxg`, `stw`, `sus`, `susp`, `svd`, `sis`, `sisx`, `xsm`, `bdm`, `xdm`, `ddf`, `tao`, `pcap`, `cap`, `dmp`, `tmo`, `tpt`, `mxs`, `tra`, `ufd`, `ufdl`, `utz`, `umj`, `unityweb`, `uoml`, `vcx`, `vsd`, `vst`, `vss`, `vsw`, `vis`, `vsf`, `wbxml`, `wmlc`, `wmlsc`, `wtb`, `nbp`, `wpd`, `wqd`, `stf`, `xar`, `xfdl`, `hvd`, `hvs`, `hvp`, `osf`, `osfpvg`, `saf`, `spf`, `cmp`, `zir`, `zirz`, `zaz`, `7z`, `abw`, `ace`, `*dmg`, `arj`, `aab`, `x32`, `u32`, `vox`, `aam`, `aas`, `bcpio`, `*bdoc`, `torrent`, `blb`, `blorb`, `bz`, `bz2`, `boz`, `cbr`, `cba`, `cbt`, `cbz`, `cb7`, `vcd`, `cfs`, `chat`, `pgn`, `crx`, `cco`, `nsc`, `cpio`, `csh`, `*deb`, `udeb`, `dgc`, `dir`, `dcr`, `dxr`, `cst`, `cct`, `cxt`, `w3d`, `fgd`, `swa`, `wad`, `ncx`, `dtb`, `res`, `dvi`, `evy`, `eva`, `bdf`, `gsf`, `psf`, `pcf`, `snf`, `pfa`, `pfb`, `pfm`, `afm`, `arc`, `spl`, `gca`, `ulx`, `gnumeric`, `gramps`, `gtar`, `hdf`, `php`, `install`, `*iso`, `*key`, `*numbers`, `*pages`, `jardiff`, `jnlp`, `kdbx`, `latex`, `luac`, `lzh`, `lha`, `run`, `mie`, `prc`, `mobi`, `application`, `lnk`, `wmd`, `wmz`, `xbap`, `mdb`, `obd`, `crd`, `clp`, `*exe`, `*dll`, `com`, `bat`, `*msi`, `mvb`, `m13`, `m14`, `*wmf`, `*wmz`, `*emf`, `emz`, `mny`, `pub`, `scd`, `trm`, `wri`, `nc`, `cdf`, `pac`, `nzb`, `pl`, `pm`, `*prc`, `*pdb`, `p12`, `pfx`, `p7b`, `spc`, `p7r`, `*rar`, `rpm`, `ris`, `sea`, `sh`, `shar`, `swf`, `xap`, `sql`, `sit`, `sitx`, `srt`, `sv4cpio`, `sv4crc`, `t3`, `gam`, `tar`, `tcl`, `tk`, `tex`, `tfm`, `texinfo`, `texi`, `*obj`, `ustar`, `hdd`, `ova`, `ovf`, `vbox`, `vbox-extpack`, `vdi`, `vhd`, `vmdk`, `src`, `webapp`, `der`, `crt`, `pem`, `fig`, `*xlf`, `xpi`, `xz`, `z1`, `z2`, `z3`, `z4`, `z5`, `z6`, `z7`, `z8`, `uva`, `uvva`, `eol`, `dra`, `dts`, `dtshd`, `lvp`, `pya`, `ecelp4800`, `ecelp7470`, `ecelp9600`, `rip`, `aac`, `aif`, `aiff`, `aifc`, `caf`, `flac`, `*m4a`, `mka`, `m3u`, `wax`, `wma`, `ram`, `ra`, `rmp`, `*ra`, `cdx`, `cif`, `cmdf`, `cml`, `csml`, `xyz`, `btif`, `pti`, `psd`, `azv`, `uvi`, `uvvi`, `uvg`, `uvvg`, `djvu`, `djv`, `*sub`, `dwg`, `dxf`, `fbs`, `fpx`, `fst`, `mmr`, `rlc`, `ico`, `dds`, `mdi`, `wdp`, `npx`, `b16`, `tap`, `vtf`, `wbmp`, `xif`, `pcx`, `3ds`, `ras`, `cmx`, `fh`, `fhc`, `fh4`, `fh5`, `fh7`, `*ico`, `jng`, `sid`, `*bmp`, `*pcx`, `pic`, `pct`, `pnm`, `pbm`, `pgm`, `ppm`, `rgb`, `tga`, `xbm`, `xpm`, `xwd`, `wsc`, `dae`, `dwf`, `gdl`, `gtw`, `mts`, `ogex`, `x_b`, `x_t`, `vds`, `usdz`, `bsp`, `vtu`, `dsc`, `curl`, `dcurl`, `mcurl`, `scurl`, `sub`, `fly`, `flx`, `gv`, `3dml`, `spot`, `jad`, `wml`, `wmls`, `s`, `asm`, `c`, `cc`, `cxx`, `cpp`, `h`, `hh`, `dic`, `htc`, `f`, `for`, `f77`, `f90`, `hbs`, `java`, `lua`, `mkd`, `nfo`, `opml`, `*org`, `p`, `pas`, `pde`, `sass`, `scss`, `etx`, `sfv`, `ymp`, `uu`, `vcs`, `vcf`, `uvh`, `uvvh`, `uvm`, `uvvm`, `uvp`, `uvvp`, `uvs`, `uvvs`, `uvv`, `uvvv`, `dvb`, `fvt`, `mxu`, `m4u`, `pyv`, `uvu`, `uvvu`, `viv`, `f4v`, `fli`, `flv`, `m4v`, `mkv`, `mk3d`, `mks`, `mng`, `asf`, `asx`, `vob`, `wm`, `wmv`, `wmx`, `wvx`, `avi`, `movie`, `smv`, `ice`, `mht` |
| `TicketingTicketPriorityTypeEnum` | `lowest`, `low`, `medium`, `high`, `highest` |
| `TicketingTicketStatusTypeEnum` | `to-do`, `in-progress`, `closed` |
| `TicketingUserTypeEnum` | `agent`, `contact`, `bot` |
