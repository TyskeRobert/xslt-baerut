<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="3.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:tei="http://www.tei-c.org/ns/1.0">
    <xsl:output encoding="UTF-8" method="json" indent="yes"/>
    <xsl:strip-space elements="*"/>
    <xsl:include href="header.xsl"/>
    <xsl:include href="text.xsl"/>
    <xsl:template match="/">
        <xsl:variable name="sources" as="map(*)+">
            <xsl:apply-templates/>
        </xsl:variable>
        <xsl:map>
            <xsl:map-entry key="'date'" select="current-dateTime()"/>
            <xsl:map-entry key="'sources'" select="array{$sources}"/>
        </xsl:map>
    </xsl:template>
    <xsl:template match="source">
        <xsl:variable name="filename" select="concat('../tei/', @id, '.xml')"/>
        <xsl:variable name="file" select="doc($filename)"/>
        <xsl:map>
            <xsl:map-entry key="'id'" select="string(@id)"/>
            <xsl:apply-templates select="$file/tei:TEI"/>
        </xsl:map>
    </xsl:template>
    <xsl:template match="tei:TEI">
        <xsl:apply-templates/>
    </xsl:template>
</xsl:stylesheet>